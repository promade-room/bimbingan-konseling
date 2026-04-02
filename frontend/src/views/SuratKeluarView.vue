<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-semibold text-xl text-brand-primary tracking-wider">SURAT KELUAR</h1>
      <button v-if="canCreate" @click="openModal()" class="cyber-btn-primary">+ Tambah</button>
    </div>

    <SearchFilter v-model:search="search" @refresh="fetchData()">
      <input type="date" v-model="filterDari" @change="fetchData()" class="cyber-input w-auto" />
      <input type="date" v-model="filterSampai" @change="fetchData()" class="cyber-input w-auto" />
    </SearchFilter>

    <div class="cyber-card">
      <DataTable :columns="columns" :data="data" :loading="loading" :pagination="pagination" @page-change="fetchData($event)">
        <template #file="{ row }">
          <a v-if="row.file" :href="'/uploads/' + row.file" target="_blank" class="text-brand-primary hover:underline text-xs">📄 Lihat</a>
          <span v-else class="text-brand-muted text-xs">-</span>
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2" v-if="canCreate">
            <button @click="openModal(row)" class="text-brand-primary hover:text-brand-primary/80 text-xs">Edit</button>
            <button v-if="auth.user?.role === 'admin'" @click="handleDelete(row)" class="text-brand-danger hover:text-brand-danger/80 text-xs">Hapus</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal :show="showModal" :title="editId ? 'Edit Surat Keluar' : 'Tambah Surat Keluar'" @close="showModal = false">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="label-cyber">Nomor Surat *</label>
          <input v-model="form.nomor_surat" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">Tanggal Surat *</label>
          <input type="date" v-model="form.tanggal_surat" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">Tujuan *</label>
          <input v-model="form.tujuan" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">Perihal *</label>
          <input v-model="form.perihal" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">File (PDF, JPG, PNG, DOC)</label>
          <input type="file" @change="handleFile" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="cyber-input" />
        </div>
        <div>
          <label class="label-cyber">Keterangan</label>
          <textarea v-model="form.keterangan" class="cyber-input" rows="2"></textarea>
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
import SearchFilter from '../components/ui/SearchFilter.vue'
import DataTable from '../components/ui/DataTable.vue'
import Modal from '../components/ui/Modal.vue'

const api = useApi()
const auth = useAuthStore()
const canCreate = ['admin', 'guru_bk'].includes(auth.user?.role)

const columns = [
  { key: 'nomor_surat', label: 'Nomor Surat' },
  { key: 'tanggal_surat', label: 'Tanggal' },
  { key: 'tujuan', label: 'Tujuan' },
  { key: 'perihal', label: 'Perihal' },
  { key: 'file', label: 'File' }
]

const data = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const filterDari = ref('')
const filterSampai = ref('')
const pagination = ref(null)
const showModal = ref(false)
const editId = ref(null)
const selectedFile = ref(null)
const form = ref({ nomor_surat: '', tanggal_surat: '', tujuan: '', perihal: '', keterangan: '' })

async function fetchData(page = 1) {
  loading.value = true
  try {
    const params = { page, search: search.value, tanggal_dari: filterDari.value, tanggal_sampai: filterSampai.value }
    const { data: res } = await api.get('/surat-keluar', { params })
    data.value = res.data
    pagination.value = res.pagination
  } catch { Swal.fire('Error', 'Gagal memuat data', 'error') }
  finally { loading.value = false }
}

function handleFile(e) { selectedFile.value = e.target.files[0] || null }

function openModal(row = null) {
  if (row) {
    editId.value = row.id
    form.value = { nomor_surat: row.nomor_surat, tanggal_surat: row.tanggal_surat?.split('T')[0], tujuan: row.tujuan, perihal: row.perihal, keterangan: row.keterangan || '' }
  } else {
    editId.value = null
    form.value = { nomor_surat: '', tanggal_surat: new Date().toISOString().split('T')[0], tujuan: '', perihal: '', keterangan: '' }
  }
  selectedFile.value = null
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
    if (selectedFile.value) fd.append('file', selectedFile.value)

    if (editId.value) {
      await api.put(`/surat-keluar/${editId.value}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      Swal.fire('Berhasil', 'Surat keluar berhasil diupdate', 'success')
    } else {
      await api.post('/surat-keluar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      Swal.fire('Berhasil', 'Surat keluar berhasil dicatat', 'success')
    }
    showModal.value = false
    fetchData()
  } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error') }
  finally { saving.value = false }
}

async function handleDelete(row) {
  const confirm = await Swal.fire({ title: 'Hapus?', text: `Hapus surat ${row.nomor_surat}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ff3366', cancelButtonColor: '#2a2a5e', confirmButtonText: 'Hapus', cancelButtonText: 'Batal' })
  if (confirm.isConfirmed) {
    try { await api.delete(`/surat-keluar/${row.id}`); Swal.fire('Berhasil', 'Surat berhasil dihapus', 'success'); fetchData() }
    catch { Swal.fire('Error', 'Gagal menghapus', 'error') }
  }
}

onMounted(fetchData)
</script>

<style scoped>
.label-cyber { @apply block text-xs text-brand-muted uppercase tracking-wider mb-1.5 font-medium; }
</style>
