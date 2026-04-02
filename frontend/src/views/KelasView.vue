<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-semibold text-xl text-brand-primary tracking-wider">DATA KELAS</h1>
      <button v-if="auth.user?.role === 'admin'" @click="openModal()" class="cyber-btn-primary">+ Tambah</button>
    </div>

    <SearchFilter v-model:search="search" @refresh="fetchData">
      <select v-model="filterTingkat" @change="fetchData" class="cyber-input w-auto">
        <option value="">Semua Tingkat</option>
        <option value="7">Kelas 7</option>
        <option value="8">Kelas 8</option>
        <option value="9">Kelas 9</option>
      </select>
    </SearchFilter>

    <div class="cyber-card">
      <DataTable :columns="columns" :data="filteredData" :loading="loading">
        <template #actions="{ row }">
          <div class="flex gap-2" v-if="auth.user?.role === 'admin'">
            <button @click="openModal(row)" class="text-brand-primary hover:text-brand-primary/80 text-xs">Edit</button>
            <button @click="handleDelete(row)" class="text-brand-danger hover:text-brand-danger/80 text-xs">Hapus</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal :show="showModal" :title="editId ? 'Edit Kelas' : 'Tambah Kelas'" @close="showModal = false">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="label-cyber">Nama Kelas *</label>
          <input v-model="form.nama_kelas" class="cyber-input" placeholder="7A" required />
        </div>
        <div>
          <label class="label-cyber">Tingkat *</label>
          <select v-model="form.tingkat" class="cyber-input" required>
            <option value="">Pilih Tingkat</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Wali Kelas</label>
          <select v-model="form.wali_kelas_id" class="cyber-input">
            <option value="">Pilih Wali Kelas</option>
            <option v-for="u in guruList" :key="u.id" :value="u.id">{{ u.nama }}</option>
          </select>
        </div>
        <div class="flex gap-3 justify-end pt-2">
          <button type="button" @click="showModal = false" class="cyber-btn-ghost">Batal</button>
          <button type="submit" class="cyber-btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuthStore } from '../stores/auth'
import Swal from 'sweetalert2'
import SearchFilter from '../components/ui/SearchFilter.vue'
import DataTable from '../components/ui/DataTable.vue'
import Modal from '../components/ui/Modal.vue'

const api = useApi()
const auth = useAuthStore()

const columns = [
  { key: 'nama_kelas', label: 'Nama Kelas' },
  { key: 'tingkat', label: 'Tingkat' },
  { key: 'wali_kelas_nama', label: 'Wali Kelas' }
]

const data = ref([])
const guruList = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const filterTingkat = ref('')
const showModal = ref(false)
const editId = ref(null)
const form = ref({ nama_kelas: '', tingkat: '', wali_kelas_id: '' })

const filteredData = computed(() => {
  let result = data.value
  if (search.value) {
    const s = search.value.toLowerCase()
    result = result.filter(r => r.nama_kelas?.toLowerCase().includes(s))
  }
  if (filterTingkat.value) result = result.filter(r => r.tingkat === filterTingkat.value)
  return result
})

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await api.get('/kelas')
    data.value = res
  } catch { Swal.fire('Error', 'Gagal memuat data', 'error') }
  finally { loading.value = false }
}

function openModal(row = null) {
  if (row) {
    editId.value = row.id
    form.value = { nama_kelas: row.nama_kelas, tingkat: row.tingkat, wali_kelas_id: row.wali_kelas_id || '' }
  } else {
    editId.value = null
    form.value = { nama_kelas: '', tingkat: '', wali_kelas_id: '' }
  }
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    const payload = { ...form.value, wali_kelas_id: form.value.wali_kelas_id || null }
    if (editId.value) {
      await api.put(`/kelas/${editId.value}`, payload)
      Swal.fire('Berhasil', 'Kelas berhasil diupdate', 'success')
    } else {
      await api.post('/kelas', payload)
      Swal.fire('Berhasil', 'Kelas berhasil ditambahkan', 'success')
    }
    showModal.value = false
    fetchData()
  } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error') }
  finally { saving.value = false }
}

async function handleDelete(row) {
  const confirm = await Swal.fire({ title: 'Hapus?', text: `Hapus kelas ${row.nama_kelas}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ff3366', cancelButtonColor: '#2a2a5e', confirmButtonText: 'Hapus', cancelButtonText: 'Batal' })
  if (confirm.isConfirmed) {
    try { await api.delete(`/kelas/${row.id}`); Swal.fire('Berhasil', 'Kelas berhasil dihapus', 'success'); fetchData() }
    catch { Swal.fire('Error', 'Gagal menghapus', 'error') }
  }
}

onMounted(async () => {
  const { data: users } = await api.get('/users', { params: { role: 'guru_bk', limit: 100 } })
  guruList.value = users.data || []
  // also load wali_kelas
  const { data: wali } = await api.get('/users', { params: { role: 'wali_kelas', limit: 100 } })
  guruList.value = [...guruList.value, ...(wali.data || [])]
  fetchData()
})
</script>

<style scoped>
.label-cyber { @apply block text-xs text-brand-muted uppercase tracking-wider mb-1.5 font-medium; }
</style>
