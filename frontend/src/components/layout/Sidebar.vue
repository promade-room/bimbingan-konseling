<template>
  <!-- Mobile overlay -->
  <div v-if="open" class="fixed inset-0 bg-black/30 z-40 md:hidden" @click="$emit('close')"></div>

  <aside
    :class="[
      'fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand-sidebar flex flex-col transition-transform duration-300',
      open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="px-6 py-5 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-brand-primary rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h1 class="font-bold text-white text-sm">BK System</h1>
          <p class="text-xs text-brand-sidebar-text/60">MTs Muhammadiyah 1</p>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
        :class="$route.path === item.path
          ? 'bg-brand-primary text-white shadow-sm'
          : 'text-brand-sidebar-text hover:bg-white/10 hover:text-white'"
        @click="$emit('close')"
      >
        <span class="text-lg w-5 text-center">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-3 border-t border-white/10 text-xs text-brand-sidebar-text/50 text-center">
      BK System v1.0
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
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/siswa', label: 'Data Siswa', icon: '👤' },
    { path: '/kelas', label: 'Data Kelas', icon: '🏫' },
    { path: '/konseling', label: 'Konseling', icon: '💬' },
    { path: '/pelanggaran', label: 'Pelanggaran', icon: '⚠️' },
    { path: '/jenis-pelanggaran', label: 'Jenis Pelanggaran', icon: '📋' },
    { path: '/surat-masuk', label: 'Surat Masuk', icon: '📥' },
    { path: '/surat-keluar', label: 'Surat Keluar', icon: '📤' },
    { path: '/laporan', label: 'Laporan', icon: '📈' }
  ]

  if (auth.user?.role === 'admin') {
    items.push({ path: '/users', label: 'Manajemen User', icon: '👥' })
  }

  items.push({ path: '/profil', label: 'Profil', icon: '⚙️' })
  return items
})
</script>
