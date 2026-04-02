<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-semibold text-xl text-brand-primary tracking-wider">DATA SISWA</h1>
      <button v-if="canCreate" @click="openModal()" class="cyber-btn-primary">+ Tambah</button>
    </div>

    <SearchFilter v-model:search="search" @refresh="fetchData">
      <select v-model="filterKelas" @change="fetchData" class="cyber-input w-auto">
        <option value="">Semua Kelas</option>
        <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.nama_kelas }}</option>
      </select>
    </SearchFilter>

    <div class="cyber-card">
      <DataTable :columns="columns" :data="data" :loading="loading" :pagination="pagination" @page-change="fetchData($event)">
        <template #jenis_kelamin="{ value }">
          {{ value === 'L' ? 'Laki-laki' : 'Perempuan' }}
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2">
            <button v-if="canCreate" @click="openModal(row)" class="text-brand-primary hover:text-brand-primary/80 text-xs">Edit</button>
            <button v-if="canCreate" @click="handleDelete(row)" class="text-brand-danger hover:text-brand-danger/80 text-xs">Hapus</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal :show="showModal" :title="editId ? 'Edit Siswa' : 'Tambah Siswa'" @close="showModal = false">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="label-cyber">NIS *</label>
          <input v-model="form.nis" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">NISN</label>
          <input v-model="form.nisn" class="cyber-input" />
        </div>
        <div>
          <label class="label-cyber">Nama *</label>
          <input v-model="form.nama" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">Jenis Kelamin *</label>
          <select v-model="form.jenis_kelamin" class="cyber-input" required>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Kelas *</label>
          <select v-model="form.kelas_id" class="cyber-input" required>
            <option value="">Pilih Kelas</option>
            <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.nama_kelas }}</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Alamat</label>
          <textarea v-model="form.alamat" class="cyber-input" rows="2"></textarea>
        </div>
        <div>
          <label class="label-cyber">No HP Orang Tua</label>
          <input v-model="form.no_hp_ortu" class="cyber-input" />
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
const canCreate = computed(() => ['admin', 'guru_bk'].includes(auth.user?.role))

const columns = [
  { key: 'nis', label: 'NIS' },
  { key: 'nama', label: 'Nama' },
  { key: 'jenis_kelamin', label: 'JK' },
  { key: 'nama_kelas', label: 'Kelas' },
  { key: 'no_hp_ortu', label: 'No HP Ortu' }
]

const data = ref([])
const kelasList = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const filterKelas = ref('')
const pagination = ref(null)
const showModal = ref(false)
const editId = ref(null)
const form = ref({ nis: '', nisn: '', nama: '', jenis_kelamin: 'L', kelas_id: '', alamat: '', no_hp_ortu: '' })

async function fetchData(page = 1) {
  loading.value = true
  try {
    const params = { page, search: search.value, kelas_id: filterKelas.value }
    const { data: res } = await api.get('/siswa', { params })
    data.value = res.data
    pagination.value = res.pagination
  } catch { Swal.fire('Error', 'Gagal memuat data', 'error') }
  finally { loading.value = false }
}

function openModal(row = null) {
  if (row) {
    editId.value = row.id
    form.value = { nis: row.nis, nisn: row.nisn || '', nama: row.nama, jenis_kelamin: row.jenis_kelamin, kelas_id: row.kelas_id, alamat: row.alamat || '', no_hp_ortu: row.no_hp_ortu || '' }
  } else {
    editId.value = null
    form.value = { nis: '', nisn: '', nama: '', jenis_kelamin: 'L', kelas_id: '', alamat: '', no_hp_ortu: '' }
  }
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editId.value) {
      await api.put(`/siswa/${editId.value}`, form.value)
      Swal.fire('Berhasil', 'Siswa berhasil diupdate', 'success')
    } else {
      await api.post('/siswa', form.value)
      Swal.fire('Berhasil', 'Siswa berhasil ditambahkan', 'success')
    }
    showModal.value = false
    fetchData()
  } catch (err) {
    Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error')
  } finally { saving.value = false }
}

async function handleDelete(row) {
  const confirm = await Swal.fire({ title: 'Hapus?', text: `Hapus siswa ${row.nama}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ff3366', cancelButtonColor: '#2a2a5e', confirmButtonText: 'Hapus', cancelButtonText: 'Batal' })
  if (confirm.isConfirmed) {
    try {
      await api.delete(`/siswa/${row.id}`)
      Swal.fire('Berhasil', 'Siswa berhasil dihapus', 'success')
      fetchData()
    } catch { Swal.fire('Error', 'Gagal menghapus', 'error') }
  }
}

let searchTimeout = null
const debouncedSearch = () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => fetchData(), 300) }

onMounted(async () => {
  const { data: kelas } = await api.get('/kelas')
  kelasList.value = kelas
  fetchData()
})
</script>

<style scoped>
.label-cyber { @apply block text-xs text-brand-muted uppercase tracking-wider mb-1.5 font-medium; }
</style>
