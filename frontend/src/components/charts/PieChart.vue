<template>
  <Pie :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  labels: { type: Array, default: () => [] },
  values: { type: Array, default: () => [] }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    data: props.values,
    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
    borderColor: '#ffffff',
    borderWidth: 3
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#64748b', font: { family: 'Inter' }, padding: 16 } }
  }
}
</script>
