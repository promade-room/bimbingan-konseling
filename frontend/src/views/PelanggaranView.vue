<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-semibold text-xl text-brand-primary tracking-wider">PELANGGARAN</h1>
      <button v-if="canCreate" @click="openModal()" class="cyber-btn-primary">+ Tambah</button>
    </div>

    <SearchFilter v-model:search="search" @refresh="fetchData()">
      <select v-model="filterKelas" @change="fetchData()" class="cyber-input w-auto">
        <option value="">Semua Kelas</option>
        <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.nama_kelas }}</option>
      </select>
      <select v-model="filterTingkat" @change="fetchData()" class="cyber-input w-auto">
        <option value="">Semua Tingkat</option>
        <option value="ringan">Ringan</option>
        <option value="sedang">Sedang</option>
        <option value="berat">Berat</option>
      </select>
      <input type="date" v-model="filterTanggalDari" @change="fetchData()" class="cyber-input w-auto" />
      <input type="date" v-model="filterTanggalSampai" @change="fetchData()" class="cyber-input w-auto" />
    </SearchFilter>

    <div class="cyber-card">
      <DataTable :columns="columns" :data="data" :loading="loading" :pagination="pagination" @page-change="fetchData($event)">
        <template #jenis_tingkat="{ value }">
          <span :class="'badge-' + value">{{ value?.charAt(0).toUpperCase() + value?.slice(1) }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2" v-if="canCreate">
            <button @click="openModal(row)" class="text-brand-primary hover:text-brand-primary/80 text-xs">Edit</button>
            <button v-if="auth.user?.role === 'admin'" @click="handleDelete(row)" class="text-brand-danger hover:text-brand-danger/80 text-xs">Hapus</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal :show="showModal" :title="editId ? 'Edit Pelanggaran' : 'Tambah Pelanggaran'" @close="showModal = false">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="label-cyber">Siswa *</label>
          <select v-model="form.siswa_id" class="cyber-input" required>
            <option value="">Pilih Siswa</option>
            <option v-for="s in siswaList" :key="s.id" :value="s.id">{{ s.nama }} ({{ s.nama_kelas }})</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Jenis Pelanggaran *</label>
          <select v-model="form.jenis_pelanggaran_id" class="cyber-input" required>
            <option value="">Pilih Jenis</option>
            <option v-for="jp in jenisList" :key="jp.id" :value="jp.id">{{ jp.nama }} ({{ jp.tingkat }} - {{ jp.poin }} poin)</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Tanggal *</label>
          <input type="date" v-model="form.tanggal" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">Sanksi</label>
          <textarea v-model="form.sanksi" class="cyber-input" rows="2"></textarea>
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
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuthStore } from '../stores/auth'
import Swal from 'sweetalert2'
import SearchFilter from '../components/ui/SearchFilter.vue'
import DataTable from '../components/ui/DataTable.vue'
import Modal from '../components/ui/Modal.vue'

const api = useApi()
const auth = useAuthStore()
const canCreate = computed(() => ['admin', 'guru_bk', 'wali_kelas'].includes(auth.user?.role))

const columns = [
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'siswa_nama', label: 'Siswa' },
  { key: 'nama_kelas', label: 'Kelas' },
  { key: 'jenis_nama', label: 'Jenis Pelanggaran' },
  { key: 'jenis_tingkat', label: 'Tingkat' },
  { key: 'poin', label: 'Poin' },
  { key: 'guru_pencatat_nama', label: 'Pencatat' }
]

const data = ref([])
const siswaList = ref([])
const kelasList = ref([])
const jenisList = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const filterKelas = ref('')
const filterTingkat = ref('')
const filterTanggalDari = ref('')
const filterTanggalSampai = ref('')
const pagination = ref(null)
const showModal = ref(false)
const editId = ref(null)
const form = ref({ siswa_id: '', jenis_pelanggaran_id: '', tanggal: '', sanksi: '', keterangan: '' })

async function fetchData(page = 1) {
  loading.value = true
  try {
    const params = { page, search: search.value, kelas_id: filterKelas.value, tingkat: filterTingkat.value, tanggal_dari: filterTanggalDari.value, tanggal_sampai: filterTanggalSampai.value }
    const { data: res } = await api.get('/pelanggaran', { params })
    data.value = res.data
    pagination.value = res.pagination
  } catch { Swal.fire('Error', 'Gagal memuat data', 'error') }
  finally { loading.value = false }
}

function openModal(row = null) {
  if (row) {
    editId.value = row.id
    form.value = { siswa_id: row.siswa_id, jenis_pelanggaran_id: row.jenis_pelanggaran_id, tanggal: row.tanggal?.split('T')[0], sanksi: row.sanksi || '', keterangan: row.keterangan || '' }
  } else {
    editId.value = null
    form.value = { siswa_id: '', jenis_pelanggaran_id: '', tanggal: new Date().toISOString().split('T')[0], sanksi: '', keterangan: '' }
  }
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editId.value) {
      await api.put(`/pelanggaran/${editId.value}`, form.value)
      Swal.fire('Berhasil', 'Pelanggaran berhasil diupdate', 'success')
    } else {
      await api.post('/pelanggaran', form.value)
      Swal.fire('Berhasil', 'Pelanggaran berhasil dicatat', 'success')
    }
    showModal.value = false
    fetchData()
  } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error') }
  finally { saving.value = false }
}

async function handleDelete(row) {
  const confirm = await Swal.fire({ title: 'Hapus?', text: 'Hapus catatan pelanggaran ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ff3366', cancelButtonColor: '#2a2a5e', confirmButtonText: 'Hapus', cancelButtonText: 'Batal' })
  if (confirm.isConfirmed) {
    try { await api.delete(`/pelanggaran/${row.id}`); Swal.fire('Berhasil', 'Pelanggaran berhasil dihapus', 'success'); fetchData() }
    catch { Swal.fire('Error', 'Gagal menghapus', 'error') }
  }
}

onMounted(async () => {
  const [kelasRes, siswaRes, jenisRes] = await Promise.all([
    api.get('/kelas'),
    api.get('/siswa', { params: { limit: 1000 } }),
    api.get('/jenis-pelanggaran')
  ])
  kelasList.value = kelasRes.data
  siswaList.value = siswaRes.data.data || siswaRes.data
  jenisList.value = jenisRes.data
  fetchData()
})
</script>

<style scoped>
.label-cyber { @apply block text-xs text-brand-muted uppercase tracking-wider mb-1.5 font-medium; }
</style>
