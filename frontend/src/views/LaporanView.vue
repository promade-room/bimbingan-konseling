<template>
  <div>
    <h1 class="font-semibold text-xl text-brand-primary mb-6">LAPORAN</h1>

    <!-- Tab -->
    <div class="flex gap-2 mb-6">
      <button @click="activeTab = 'konseling'" :class="activeTab === 'konseling' ? 'cyber-btn-primary' : 'cyber-btn-ghost'">Laporan Konseling</button>
      <button @click="activeTab = 'pelanggaran'" :class="activeTab === 'pelanggaran' ? 'cyber-btn-primary' : 'cyber-btn-ghost'">Laporan Pelanggaran</button>
    </div>

    <!-- Filters -->
    <div class="cyber-card mb-6 no-print">
      <div class="flex flex-wrap gap-3 items-end">
        <div>
          <label class="label-cyber">Dari Tanggal</label>
          <input type="date" v-model="tanggalDari" class="cyber-input" />
        </div>
        <div>
          <label class="label-cyber">Sampai Tanggal</label>
          <input type="date" v-model="tanggalSampai" class="cyber-input" />
        </div>
        <div>
          <label class="label-cyber">Kelas</label>
          <select v-model="filterKelas" class="cyber-input">
            <option value="">Semua Kelas</option>
            <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.nama_kelas }}</option>
          </select>
        </div>
        <div v-if="activeTab === 'konseling'">
          <label class="label-cyber">Jenis Layanan</label>
          <select v-model="filterJenis" class="cyber-input">
            <option value="">Semua</option>
            <option value="konsultasi">Konsultasi</option>
            <option value="kunjungan_rumah">Kunjungan Rumah</option>
            <option value="bimbingan_klasikal">Bimbingan Klasikal</option>
            <option value="mediator">Mediator</option>
          </select>
        </div>
        <div v-if="activeTab === 'pelanggaran'">
          <label class="label-cyber">Tingkat</label>
          <select v-model="filterTingkat" class="cyber-input">
            <option value="">Semua</option>
            <option value="ringan">Ringan</option>
            <option value="sedang">Sedang</option>
            <option value="berat">Berat</option>
          </select>
        </div>
        <button @click="fetchReport" class="cyber-btn-primary">Tampilkan</button>
        <button @click="printReport" class="cyber-btn-success">🖨️ Cetak</button>
      </div>
    </div>

    <!-- Report Konseling -->
    <div v-if="activeTab === 'konseling'" class="cyber-card print:bg-white print:text-black">
      <div class="text-center mb-6">
        <h2 class="font-semibold text-lg print:text-black">LAPORAN KONSELING</h2>
        <p class="text-sm text-brand-muted print:text-gray-600">Bimbingan Konseling - MTs Muhammadiyah 1 Palembang</p>
        <p v-if="tanggalDari || tanggalSampai" class="text-xs text-brand-muted print:text-gray-600">
          Periode: {{ tanggalDari || '...' }} s/d {{ tanggalSampai || '...' }}
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="cyber-table print:border-collapse">
          <thead>
            <tr class="print:border-b-2 print:border-black">
              <th class="print:text-black print:border print:border-gray-300">No</th>
              <th class="print:text-black print:border print:border-gray-300">Tanggal</th>
              <th class="print:text-black print:border print:border-gray-300">NIS</th>
              <th class="print:text-black print:border print:border-gray-300">Nama Siswa</th>
              <th class="print:text-black print:border print:border-gray-300">Kelas</th>
              <th class="print:text-black print:border print:border-gray-300">Jenis Layanan</th>
              <th class="print:text-black print:border print:border-gray-300">Kategori</th>
              <th class="print:text-black print:border print:border-gray-300">Status</th>
              <th class="print:text-black print:border print:border-gray-300">Guru BK</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in reportData" :key="row.id" class="print:border-b print:border-gray-200">
              <td class="print:text-black print:border print:border-gray-300">{{ i + 1 }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ formatDate(row.tanggal) }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.nis }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.siswa_nama }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.nama_kelas }}</td>
              <td class="print:text-black print:border print:border-gray-300 capitalize">{{ row.jenis_layanan?.replace('_', ' ') }}</td>
              <td class="print:text-black print:border print:border-gray-300 capitalize">{{ row.kategori }}</td>
              <td class="print:text-black print:border print:border-gray-300 capitalize">{{ row.status?.replace('_', ' ') }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.guru_bk_nama }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="reportData.length === 0" class="text-center text-brand-muted py-8">Tidak ada data</p>
      <p class="text-sm text-brand-muted mt-4 print:text-gray-600">Total: {{ reportData.length }} catatan</p>
    </div>

    <!-- Report Pelanggaran -->
    <div v-if="activeTab === 'pelanggaran'" class="cyber-card print:bg-white print:text-black">
      <div class="text-center mb-6">
        <h2 class="font-semibold text-lg print:text-black">LAPORAN PELANGGARAN</h2>
        <p class="text-sm text-brand-muted print:text-gray-600">Bimbingan Konseling - MTs Muhammadiyah 1 Palembang</p>
        <p v-if="tanggalDari || tanggalSampai" class="text-xs text-brand-muted print:text-gray-600">
          Periode: {{ tanggalDari || '...' }} s/d {{ tanggalSampai || '...' }}
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="cyber-table print:border-collapse">
          <thead>
            <tr class="print:border-b-2 print:border-black">
              <th class="print:text-black print:border print:border-gray-300">No</th>
              <th class="print:text-black print:border print:border-gray-300">Tanggal</th>
              <th class="print:text-black print:border print:border-gray-300">NIS</th>
              <th class="print:text-black print:border print:border-gray-300">Nama Siswa</th>
              <th class="print:text-black print:border print:border-gray-300">Kelas</th>
              <th class="print:text-black print:border print:border-gray-300">Pelanggaran</th>
              <th class="print:text-black print:border print:border-gray-300">Tingkat</th>
              <th class="print:text-black print:border print:border-gray-300">Poin</th>
              <th class="print:text-black print:border print:border-gray-300">Sanksi</th>
              <th class="print:text-black print:border print:border-gray-300">Pencatat</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in reportData" :key="row.id" class="print:border-b print:border-gray-200">
              <td class="print:text-black print:border print:border-gray-300">{{ i + 1 }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ formatDate(row.tanggal) }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.nis }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.siswa_nama }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.nama_kelas }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.jenis_nama }}</td>
              <td class="print:text-black print:border print:border-gray-300 capitalize">{{ row.jenis_tingkat }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.poin }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.sanksi || '-' }}</td>
              <td class="print:text-black print:border print:border-gray-300">{{ row.guru_pencatat_nama }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="reportData.length === 0" class="text-center text-brand-muted py-8">Tidak ada data</p>
      <p class="text-sm text-brand-muted mt-4 print:text-gray-600">Total: {{ reportData.length }} catatan</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import Swal from 'sweetalert2'

const api = useApi()
const activeTab = ref('konseling')
const tanggalDari = ref('')
const tanggalSampai = ref('')
const filterKelas = ref('')
const filterJenis = ref('')
const filterTingkat = ref('')
const kelasList = ref([])
const reportData = ref([])
const loading = ref(false)

function formatDate(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

async function fetchReport() {
  loading.value = true
  try {
    const endpoint = activeTab.value === 'konseling' ? '/laporan/konseling' : '/laporan/pelanggaran'
    const params = { tanggal_dari: tanggalDari.value, tanggal_sampai: tanggalSampai.value, kelas_id: filterKelas.value }
    if (activeTab.value === 'konseling') params.jenis_layanan = filterJenis.value
    else params.tingkat = filterTingkat.value

    const { data } = await api.get(endpoint, { params })
    reportData.value = data
  } catch { Swal.fire('Error', 'Gagal memuat laporan', 'error') }
  finally { loading.value = false }
}

function printReport() { window.print() }

onMounted(async () => {
  const { data } = await api.get('/kelas')
  kelasList.value = data
})
</script>

<style scoped>
.label-cyber { @apply block text-xs text-brand-muted uppercase tracking-wider mb-1.5 font-medium; }
</style>
