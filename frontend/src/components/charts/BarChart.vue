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
    backgroundColor: 'rgba(0, 240, 255, 0.3)',
    borderColor: '#00f0ff',
    borderWidth: 1,
    borderRadius: 4
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#e0e0e0', font: { family: 'Rajdhani' } } }
  },
  scales: {
    x: { ticks: { color: '#8888aa' }, grid: { color: 'rgba(42, 42, 94, 0.3)' } },
    y: { ticks: { color: '#8888aa' }, grid: { color: 'rgba(42, 42, 94, 0.3)' } }
  }
}
</script>
