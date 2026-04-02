<template>
  <div>
    <h1 class="font-semibold text-xl text-brand-primary mb-6">DASHBOARD</h1>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      <StatCard title="Total Siswa" :value="stats.total_siswa" icon="👤" />
      <StatCard title="Konseling Bulan Ini" :value="stats.konseling_bulan_ini" icon="💬" subtitle="Kegiatan konseling" />
      <StatCard title="Pelanggaran Bulan Ini" :value="stats.pelanggaran_bulan_ini" icon="⚠️" subtitle="Pelanggaran tercatat" />
      <StatCard title="Total Kelas" :value="stats.total_kelas" icon="🏫" />
      <StatCard title="Surat Masuk" :value="stats.total_surat_masuk" icon="📥" />
      <StatCard title="Surat Keluar" :value="stats.total_surat_keluar" icon="📤" />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="cyber-card">
        <h3 class="font-semibold text-sm text-brand-primary mb-4">GRAFIK KONSELING PER BULAN</h3>
        <div class="h-64">
          <BarChart :labels="konselingChartLabels" :values="konselingChartValues" label="Konseling" />
        </div>
      </div>
      <div class="cyber-card">
        <h3 class="font-semibold text-sm text-brand-primary mb-4">PELANGGARAN PER TINGKAT</h3>
        <div class="h-64">
          <PieChart :labels="pelanggaranChartLabels" :values="pelanggaranChartValues" />
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="cyber-card">
      <h3 class="font-semibold text-sm text-brand-primary mb-4">AKTIVITAS TERBARU</h3>
      <div class="space-y-3">
        <div v-for="item in recentActivity" :key="item.type + item.id" class="flex items-center gap-3 p-3 rounded-lg bg-brand-bg/50 border border-brand-border/30">
          <span class="text-xl">{{ item.type === 'konseling' ? '💬' : '⚠️' }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-brand-text truncate">
              <span class="font-semibold">{{ item.siswa_nama }}</span>
              <span class="text-brand-muted"> ({{ item.nama_kelas }})</span>
            </p>
            <p class="text-xs text-brand-muted">
              {{ item.type === 'konseling' ? item.jenis_layanan : item.jenis_pelanggaran }}
              &mdash; {{ formatDate(item.tanggal) }}
            </p>
          </div>
          <span class="text-xs text-brand-muted">{{ item.guru_nama }}</span>
        </div>
        <p v-if="recentActivity.length === 0" class="text-center text-brand-muted py-4">Belum ada aktivitas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useApi } from '../composables/useApi'
import StatCard from '../components/ui/StatCard.vue'
import BarChart from '../components/charts/BarChart.vue'
import PieChart from '../components/charts/PieChart.vue'

const api = useApi()
const stats = ref({ total_siswa: 0, konseling_bulan_ini: 0, pelanggaran_bulan_ini: 0, total_kelas: 0, total_surat_masuk: 0, total_surat_keluar: 0 })
const konselingChart = ref([])
const pelanggaranChart = ref([])
const recentActivity = ref([])

const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

const konselingChartLabels = computed(() => konselingChart.value.map(i => bulanNama[i.bulan - 1]))
const konselingChartValues = computed(() => konselingChart.value.map(i => i.total))
const pelanggaranChartLabels = computed(() => pelanggaranChart.value.map(i => i.tingkat.charAt(0).toUpperCase() + i.tingkat.slice(1)))
const pelanggaranChartValues = computed(() => pelanggaranChart.value.map(i => i.total))

function formatDate(d) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  try {
    const [s, k, p, r] = await Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/konseling-chart'),
      api.get('/dashboard/pelanggaran-chart'),
      api.get('/dashboard/recent')
    ])
    stats.value = s.data
    konselingChart.value = k.data
    pelanggaranChart.value = p.data
    recentActivity.value = r.data
  } catch (err) {
    console.error('Dashboard error:', err)
  }
})
</script>
