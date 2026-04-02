<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
    <div class="relative bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl border border-brand-border">
      <div class="flex items-center justify-between px-6 py-4 border-b border-brand-border">
        <h3 class="font-semibold text-brand-text">{{ title }}</h3>
        <button @click="$emit('close')" class="text-brand-muted hover:text-brand-text transition-colors p-1 rounded-lg hover:bg-brand-bg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: { type: String, default: 'Modal' }
})
defineEmits(['close'])
</script>
