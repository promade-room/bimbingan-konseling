<template>
  <!-- Mobile overlay -->
  <div v-if="open" class="fixed inset-0 bg-black/50 z-40 md:hidden" @click="$emit('close')"></div>

  <aside
    :class="[
      'fixed md:static inset-y-0 left-0 z-50 w-64 bg-cyber-surface border-r-2 border-cyber-primary/30 flex flex-col transition-transform duration-300',
      open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="px-6 py-5 border-b border-cyber-border">
      <h1 class="font-heading text-lg text-cyber-primary tracking-widest glitch-text">BK SYSTEM</h1>
      <p class="text-xs text-cyber-muted mt-1">MTs Muhammadiyah 1 Palembang</p>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
        :class="$route.path === item.path
          ? 'bg-cyber-primary/10 text-cyber-primary border-l-2 border-cyber-primary'
          : 'text-cyber-muted hover:text-cyber-text hover:bg-white/5'"
        @click="$emit('close')"
      >
        <span class="text-lg">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-3 border-t border-cyber-border text-xs text-cyber-muted text-center">
      v1.0.0 &mdash; Cyberpunk Edition
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

defineProps({ open: Boolean })
defineEmits(['close'])

const auth = useAuthStore()

const menuItems = computed(() => {
  const items = [
    { path: '/dashboard', label: 'Dashboard', icon: '⚡' },
    { path: '/siswa', label: 'Data Siswa', icon: '👤' },
    { path: '/kelas', label: 'Data Kelas', icon: '🏫' },
    { path: '/konseling', label: 'Konseling', icon: '💬' },
    { path: '/pelanggaran', label: 'Pelanggaran', icon: '⚠️' },
    { path: '/jenis-pelanggaran', label: 'Jenis Pelanggaran', icon: '📋' },
    { path: '/surat-masuk', label: 'Surat Masuk', icon: '📥' },
    { path: '/surat-keluar', label: 'Surat Keluar', icon: '📤' },
    { path: '/laporan', label: 'Laporan', icon: '📊' }
  ]

  if (auth.user?.role === 'admin') {
    items.push({ path: '/users', label: 'Manajemen User', icon: '👥' })
  }

  items.push({ path: '/profil', label: 'Profil', icon: '⚙️' })
  return items
})
</script>
