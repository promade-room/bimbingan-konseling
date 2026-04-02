import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('bk_token') || '')
  const user = ref(JSON.parse(localStorage.getItem('bk_user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('bk_token', newToken)
    localStorage.setItem('bk_user', JSON.stringify(newUser))
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('bk_token')
    localStorage.removeItem('bk_user')
  }

  return { token, user, isAuthenticated, setAuth, logout }
})
