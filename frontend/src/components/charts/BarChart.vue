<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] },
  label: { type: String, default: 'Data' }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    label: props.label,
    data: props.values,
    backgroundColor: 'rgba(8, 145, 178, 0.7)',
    borderColor: '#0891b2',
    borderWidth: 1,
    borderRadius: 6
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#64748b', font: { family: 'Inter' } } }
  },
  scales: {
    x: { ticks: { color: '#94a3b8' }, grid: { color: '#f1f5f9' } },
    y: { ticks: { color: '#94a3b8' }, grid: { color: '#f1f5f9' } }
  }
}
</script>
