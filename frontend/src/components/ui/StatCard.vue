<template>
  <div class="cyber-card group hover:shadow-neon transition-all duration-300 cursor-default">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs text-cyber-muted uppercase tracking-wider font-heading">{{ title }}</p>
        <p class="text-3xl font-heading text-cyber-text mt-2 group-hover:text-cyber-primary transition-colors">
          {{ value }}
        </p>
        <p v-if="subtitle" class="text-xs text-cyber-muted mt-1">{{ subtitle }}</p>
      </div>
      <div class="text-3xl opacity-60 group-hover:opacity-100 transition-opacity">{{ icon }}</div>
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
