<template>
  <div class="min-h-screen flex items-center justify-center bg-cyber-bg relative scanlines overflow-hidden">
    <!-- Background grid -->
    <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px); background-size: 40px 40px;"></div>

    <div class="relative z-10 w-full max-w-md px-4">
      <div class="cyber-card">
        <div class="text-center mb-8">
          <h1 class="font-heading text-3xl text-cyber-primary tracking-widest glitch-text">BK SYSTEM</h1>
          <p class="text-cyber-muted text-sm mt-2">Bimbingan Konseling</p>
          <p class="text-cyber-muted text-xs">MTs Muhammadiyah 1 Palembang</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-xs text-cyber-muted uppercase tracking-wider mb-2 font-heading">Email</label>
            <input v-model="email" type="email" class="cyber-input" placeholder="admin@konseling.com" required />
          </div>
          <div class="mb-6">
            <label class="block text-xs text-cyber-muted uppercase tracking-wider mb-2 font-heading">Password</label>
            <input v-model="password" type="password" class="cyber-input" placeholder="••••••••" required />
          </div>

          <p v-if="error" class="text-cyber-danger text-sm mb-4">{{ error }}</p>

          <button type="submit" :disabled="loading" class="cyber-btn-primary w-full justify-center">
            {{ loading ? 'MENGHUBUNGKAN...' : 'LOGIN' }}
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-cyber-muted">
          Default: admin@konseling.com / admin123
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useApi } from '../composables/useApi'

const router = useRouter()
const auth = useAuthStore()
const api = useApi()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const { data } = await api.post('/auth/login', { email: email.value, password: password.value })
    auth.setAuth(data.token, data.user)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>
