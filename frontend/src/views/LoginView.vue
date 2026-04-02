<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary-light/30 via-brand-bg to-brand-secondary-light/30 p-4">
    <div class="w-full max-w-md">
      <div class="cyber-card">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-brand-text">Bimbingan Konseling</h1>
          <p class="text-brand-muted text-sm mt-1">MTs Muhammadiyah 1 Palembang</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label class="block text-sm font-medium text-brand-text mb-1.5">Email</label>
            <input v-model="email" type="email" class="cyber-input" placeholder="admin@konseling.com" required />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-brand-text mb-1.5">Password</label>
            <input v-model="password" type="password" class="cyber-input" placeholder="••••••••" required />
          </div>

          <p v-if="error" class="text-brand-danger text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{{ error }}</p>

          <button type="submit" :disabled="loading" class="cyber-btn-primary w-full justify-center py-3">
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-brand-muted bg-brand-bg rounded-lg py-2.5 px-4">
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
