<template>
  <div v-if="pagination && pagination.totalPages > 1" class="flex items-center justify-between mt-4 px-2">
    <p class="text-sm text-cyber-muted">
      Menampilkan {{ start }}-{{ end }} dari {{ pagination.total }} data
    </p>
    <div class="flex gap-1">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="page !== '...' && $emit('change', page)"
        :disabled="page === '...'"
        :class="[
          'px-3 py-1.5 rounded text-sm transition-all',
          page === pagination.page
            ? 'bg-cyber-primary text-cyber-bg font-bold shadow-neon'
            : page === '...'
            ? 'text-cyber-muted cursor-default'
            : 'text-cyber-muted hover:text-cyber-primary hover:bg-cyber-primary/10'
        ]"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pagination: { type: Object, required: true }
})
defineEmits(['change'])

const start = computed(() => ((props.pagination.page - 1) * props.pagination.limit) + 1)
const end = computed(() => Math.min(props.pagination.page * props.pagination.limit, props.pagination.total))

const visiblePages = computed(() => {
  const total = props.pagination.totalPages
  const current = props.pagination.page
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i)
    }
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})
</script>
