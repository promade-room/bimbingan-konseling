<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-semibold text-xl text-brand-primary tracking-wider">KONSELING</h1>
      <button v-if="canCreate" @click="openModal()" class="cyber-btn-primary">+ Tambah</button>
    </div>

    <SearchFilter v-model:search="search" @refresh="fetchData()">
      <select v-model="filterKelas" @change="fetchData()" class="cyber-input w-auto">
        <option value="">Semua Kelas</option>
        <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.nama_kelas }}</option>
      </select>
      <select v-model="filterJenis" @change="fetchData()" class="cyber-input w-auto">
        <option value="">Semua Jenis</option>
        <option value="konsultasi">Konsultasi</option>
        <option value="kunjungan_rumah">Kunjungan Rumah</option>
        <option value="bimbingan_klasikal">Bimbingan Klasikal</option>
        <option value="mediator">Mediator</option>
      </select>
      <input type="date" v-model="filterTanggalDari" @change="fetchData()" class="cyber-input w-auto" placeholder="Dari" />
      <input type="date" v-model="filterTanggalSampai" @change="fetchData()" class="cyber-input w-auto" placeholder="Sampai" />
    </SearchFilter>

    <div class="cyber-card">
      <DataTable :columns="columns" :data="data" :loading="loading" :pagination="pagination" @page-change="fetchData($event)">
        <template #jenis_layanan="{ value }">
          <span class="capitalize">{{ value?.replace('_', ' ') }}</span>
        </template>
        <template #kategori="{ value }">
          <span class="capitalize">{{ value }}</span>
        </template>
        <template #status="{ value }">
          <span :class="value === 'selesai' ? 'badge-selesai' : 'badge-tindak-lanjut'">
            {{ value === 'selesai' ? 'Selesai' : 'Tindak Lanjut' }}
          </span>
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2" v-if="canCreate">
            <button @click="openModal(row)" class="text-brand-primary hover:text-brand-primary/80 text-xs">Edit</button>
            <button v-if="auth.user?.role === 'admin'" @click="handleDelete(row)" class="text-brand-danger hover:text-brand-danger/80 text-xs">Hapus</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal :show="showModal" :title="editId ? 'Edit Konseling' : 'Tambah Konseling'" @close="showModal = false">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="label-cyber">Siswa *</label>
          <select v-model="form.siswa_id" class="cyber-input" required>
            <option value="">Pilih Siswa</option>
            <option v-for="s in siswaList" :key="s.id" :value="s.id">{{ s.nama }} ({{ s.nama_kelas }})</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Tanggal *</label>
          <input type="date" v-model="form.tanggal" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">Jenis Layanan *</label>
          <select v-model="form.jenis_layanan" class="cyber-input" required>
            <option value="konsultasi">Konsultasi</option>
            <option value="kunjungan_rumah">Kunjungan Rumah</option>
            <option value="bimbingan_klasikal">Bimbingan Klasikal</option>
            <option value="mediator">Mediator</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Kategori *</label>
          <select v-model="form.kategori" class="cyber-input" required>
            <option value="pribadi">Pribadi</option>
            <option value="belajar">Belajar</option>
            <option value="sosial">Sosial</option>
            <option value="karir">Karir</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Status</label>
          <select v-model="form.status" class="cyber-input">
            <option value="selesai">Selesai</option>
            <option value="tindak_lanjut">Tindak Lanjut</option>
          </select>
        </div>
        <div>
          <label class="label-cyber">Keterangan</label>
          <textarea v-model="form.keterangan" class="cyber-input" rows="3"></textarea>
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
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'siswa_nama', label: 'Siswa' },
  { key: 'nama_kelas', label: 'Kelas' },
  { key: 'jenis_layanan', label: 'Jenis Layanan' },
  { key: 'kategori', label: 'Kategori' },
  { key: 'status', label: 'Status' },
  { key: 'guru_bk_nama', label: 'Guru BK' }
]

const data = ref([])
const siswaList = ref([])
const kelasList = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const filterKelas = ref('')
const filterJenis = ref('')
const filterTanggalDari = ref('')
const filterTanggalSampai = ref('')
const pagination = ref(null)
const showModal = ref(false)
const editId = ref(null)
const form = ref({ siswa_id: '', tanggal: '', jenis_layanan: 'konsultasi', kategori: 'pribadi', keterangan: '', status: 'selesai' })

async function fetchData(page = 1) {
  loading.value = true
  try {
    const params = { page, search: search.value, kelas_id: filterKelas.value, jenis_layanan: filterJenis.value, tanggal_dari: filterTanggalDari.value, tanggal_sampai: filterTanggalSampai.value }
    const { data: res } = await api.get('/konseling', { params })
    data.value = res.data
    pagination.value = res.pagination
  } catch { Swal.fire('Error', 'Gagal memuat data', 'error') }
  finally { loading.value = false }
}

function openModal(row = null) {
  if (row) {
    editId.value = row.id
    form.value = { siswa_id: row.siswa_id, tanggal: row.tanggal?.split('T')[0], jenis_layanan: row.jenis_layanan, kategori: row.kategori, keterangan: row.keterangan || '', status: row.status }
  } else {
    editId.value = null
    form.value = { siswa_id: '', tanggal: new Date().toISOString().split('T')[0], jenis_layanan: 'konsultasi', kategori: 'pribadi', keterangan: '', status: 'selesai' }
  }
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editId.value) {
      await api.put(`/konseling/${editId.value}`, form.value)
      Swal.fire('Berhasil', 'Konseling berhasil diupdate', 'success')
    } else {
      await api.post('/konseling', form.value)
      Swal.fire('Berhasil', 'Konseling berhasil dicatat', 'success')
    }
    showModal.value = false
    fetchData()
  } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error') }
  finally { saving.value = false }
}

async function handleDelete(row) {
  const confirm = await Swal.fire({ title: 'Hapus?', text: 'Hapus catatan konseling ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ff3366', cancelButtonColor: '#2a2a5e', confirmButtonText: 'Hapus', cancelButtonText: 'Batal' })
  if (confirm.isConfirmed) {
    try { await api.delete(`/konseling/${row.id}`); Swal.fire('Berhasil', 'Konseling berhasil dihapus', 'success'); fetchData() }
    catch { Swal.fire('Error', 'Gagal menghapus', 'error') }
  }
}

onMounted(async () => {
  fetchData()
  try {
    const [kelasRes, siswaRes] = await Promise.all([api.get('/kelas'), api.get('/siswa', { params: { limit: 1000 } })])
    kelasList.value = kelasRes.data
    siswaList.value = siswaRes.data.data || siswaRes.data
  } catch {}
})
</script>

<style scoped>
.label-cyber { @apply block text-xs text-brand-muted uppercase tracking-wider mb-1.5 font-medium; }
</style>
