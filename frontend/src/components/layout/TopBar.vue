<template>
  <header class="h-16 bg-cyber-surface/80 backdrop-blur-md border-b border-cyber-border flex items-center justify-between px-4 md:px-6 no-print">
    <div class="flex items-center gap-3">
      <button @click="$emit('toggle-sidebar')" class="md:hidden text-cyber-muted hover:text-cyber-primary">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div>
        <h2 class="font-heading text-sm text-cyber-primary tracking-wider">{{ routeName }}</h2>
        <p class="text-xs text-cyber-muted">{{ currentDate }}</p>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-semibold text-cyber-text">{{ auth.user?.nama }}</p>
        <p class="text-xs text-cyber-muted capitalize">{{ auth.user?.role?.replace('_', ' ') }}</p>
      </div>
      <div class="w-9 h-9 rounded-full bg-cyber-primary/20 border border-cyber-primary/50 flex items-center justify-center text-cyber-primary font-heading text-sm">
        {{ initials }}
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const auth = useAuthStore()

const routeName = computed(() => route.name || 'Dashboard')
const initials = computed(() => {
  if (!auth.user?.nama) return '?'
  return auth.user.nama.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
})
const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})
</script>
