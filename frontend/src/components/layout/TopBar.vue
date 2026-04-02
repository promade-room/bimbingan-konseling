<template>
  <header class="h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 md:px-6 no-print">
    <div class="flex items-center gap-3">
      <button @click="$emit('toggle-sidebar')" class="md:hidden text-brand-muted hover:text-brand-text">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div>
        <h2 class="font-semibold text-brand-text text-sm">{{ routeName }}</h2>
        <p class="text-xs text-brand-muted">{{ currentDate }}</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <div class="text-right hidden sm:block">
        <p class="text-sm font-medium text-brand-text">{{ auth.user?.nama }}</p>
        <p class="text-xs text-brand-muted capitalize">{{ auth.user?.role?.replace('_', ' ') }}</p>
      </div>
      <button @click="router.push('/profil')" class="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-semibold text-sm hover:bg-brand-primary/20 transition-colors">
        {{ initials }}
      </button>
      <button @click="handleLogout" class="w-9 h-9 rounded-full flex items-center justify-center text-brand-muted hover:text-brand-danger hover:bg-red-50 transition-colors sm:hidden" title="Keluar">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import Swal from 'sweetalert2'

defineEmits(['toggle-sidebar'])

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

async function handleLogout() {
  const confirm = await Swal.fire({
    title: 'Keluar?',
    text: 'Anda yakin ingin keluar?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal'
  })
  if (confirm.isConfirmed) {
    auth.logout()
    router.push('/login')
  }
}

const routeName = computed(() => route.name || 'Dashboard')
const initials = computed(() => {
  if (!auth.user?.nama) return '?'
  return auth.user.nama.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
})
const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})
</script>
