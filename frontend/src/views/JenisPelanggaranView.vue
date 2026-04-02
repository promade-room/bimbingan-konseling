<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-semibold text-xl text-brand-primary tracking-wider">JENIS PELANGGARAN</h1>
      <button v-if="auth.user?.role === 'admin'" @click="openModal()" class="cyber-btn-primary">+ Tambah</button>
    </div>

    <div class="cyber-card">
      <DataTable :columns="columns" :data="data" :loading="loading">
        <template #tingkat="{ value }">
          <span :class="'badge-' + value">{{ value?.charAt(0).toUpperCase() + value?.slice(1) }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2" v-if="auth.user?.role === 'admin'">
            <button @click="openModal(row)" class="text-brand-primary hover:text-brand-primary/80 text-xs">Edit</button>
            <button @click="handleDelete(row)" class="text-brand-danger hover:text-brand-danger/80 text-xs">Hapus</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal :show="showModal" :title="editId ? 'Edit Jenis Pelanggaran' : 'Tambah Jenis Pelanggaran'" @close="showModal = false">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="label-cyber">Nama *</label>
          <input v-model="form.nama" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">Tingkat *</label>
          <select v-model="form.tingkat" class="cyber-input" required>
            <option value="ringan">Ringan</option>
            <option value="sedang">Sedang</option>
            <option value="berat">Berat</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Poin</label>
          <input type="number" v-model.number="form.poin" class="cyber-input" min="0" />
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
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuthStore } from '../stores/auth'
import Swal from 'sweetalert2'
import DataTable from '../components/ui/DataTable.vue'
import Modal from '../components/ui/Modal.vue'

const api = useApi()
const auth = useAuthStore()

const columns = [
  { key: 'nama', label: 'Nama Pelanggaran' },
  { key: 'tingkat', label: 'Tingkat' },
  { key: 'poin', label: 'Poin' }
]

const data = ref([])
const loading = ref(false)
const saving = ref(false)
const showModal = ref(false)
const editId = ref(null)
const form = ref({ nama: '', tingkat: 'ringan', poin: 0 })

async function fetchData() {
  loading.value = true
  try {
    const { data: res } = await api.get('/jenis-pelanggaran')
    data.value = res
  } catch { Swal.fire('Error', 'Gagal memuat data', 'error') }
  finally { loading.value = false }
}

function openModal(row = null) {
  if (row) {
    editId.value = row.id
    form.value = { nama: row.nama, tingkat: row.tingkat, poin: row.poin }
  } else {
    editId.value = null
    form.value = { nama: '', tingkat: 'ringan', poin: 0 }
  }
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editId.value) {
      await api.put(`/jenis-pelanggaran/${editId.value}`, form.value)
      Swal.fire('Berhasil', 'Jenis pelanggaran berhasil diupdate', 'success')
    } else {
      await api.post('/jenis-pelanggaran', form.value)
      Swal.fire('Berhasil', 'Jenis pelanggaran berhasil ditambahkan', 'success')
    }
    showModal.value = false
    fetchData()
  } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error') }
  finally { saving.value = false }
}

async function handleDelete(row) {
  const confirm = await Swal.fire({ title: 'Hapus?', text: `Hapus "${row.nama}"?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ff3366', cancelButtonColor: '#2a2a5e', confirmButtonText: 'Hapus', cancelButtonText: 'Batal' })
  if (confirm.isConfirmed) {
    try { await api.delete(`/jenis-pelanggaran/${row.id}`); Swal.fire('Berhasil', 'Berhasil dihapus', 'success'); fetchData() }
    catch { Swal.fire('Error', 'Gagal menghapus', 'error') }
  }
}

onMounted(fetchData)
</script>

<style scoped>
.label-cyber { @apply block text-xs text-brand-muted uppercase tracking-wider mb-1.5 font-medium; }
</style>
