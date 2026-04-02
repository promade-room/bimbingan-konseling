<template>
  <div class="cyber-card group hover:shadow-card-hover transition-all duration-200 cursor-default">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs text-brand-muted uppercase tracking-wider font-medium">{{ title }}</p>
        <p class="text-2xl font-bold text-brand-text mt-1.5 group-hover:text-brand-primary transition-colors">
          {{ value }}
        </p>
        <p v-if="subtitle" class="text-xs text-brand-muted mt-1">{{ subtitle }}</p>
      </div>
      <div class="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-lg">
        {{ icon }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  icon: { type: String, default: '📊' },
  subtitle: String
})
</script>
