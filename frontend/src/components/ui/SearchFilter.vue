<template>
  <div class="flex flex-wrap gap-3 mb-4">
    <input
      :value="search"
      @input="$emit('update:search', $event.target.value)"
      type="text"
      placeholder="Cari..."
      class="cyber-input max-w-xs"
    />
    <slot />
    <button @click="$emit('refresh')" class="cyber-btn-ghost">
      🔄 Refresh
    </button>
  </div>
</template>

<script setup>
defineProps({
  search: { type: String, default: '' }
})
defineEmits(['update:search', 'refresh'])
</script>
