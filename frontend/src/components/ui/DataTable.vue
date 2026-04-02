<template>
  <div>
    <div class="overflow-x-auto">
      <table class="cyber-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" :class="col.headerClass">{{ col.label }}</th>
            <th v-if="$slots.actions" class="w-32">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-center py-8 text-cyber-muted">
              <div class="animate-pulse">Loading...</div>
            </td>
          </tr>
          <tr v-else-if="data.length === 0">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-center py-8 text-cyber-muted">
              Tidak ada data
            </td>
          </tr>
          <tr v-for="(row, i) in data" :key="row.id || i">
            <td v-for="col in columns" :key="col.key">
              <slot :name="col.key" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions">
              <slot name="actions" :row="row" :index="i" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination v-if="pagination" :pagination="pagination" @change="$emit('page-change', $event)" />
  </div>
</template>

<script setup>
import Pagination from './Pagination.vue'

defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, default: () => [] },
  loading: Boolean,
  pagination: Object
})
defineEmits(['page-change'])
</script>
