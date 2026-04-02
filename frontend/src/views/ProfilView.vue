<template>
  <div>
    <h1 class="font-semibold text-xl text-brand-primary tracking-wider mb-6">PROFIL</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Profile Info -->
      <div class="cyber-card">
        <h3 class="font-semibold text-sm text-brand-primary tracking-wider mb-4">INFORMASI AKUN</h3>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label class="label-cyber">Nama</label>
            <input v-model="profileForm.nama" class="cyber-input" required />
          </div>
          <div>
            <label class="label-cyber">Email</label>
            <input type="email" v-model="profileForm.email" class="cyber-input" required />
          </div>
          <div>
            <label class="label-cyber">Role</label>
            <input :value="auth.user?.role?.replace('_', ' ')" class="cyber-input capitalize" disabled />
          </div>
          <button type="submit" class="cyber-btn-primary" :disabled="savingProfile">
            {{ savingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </form>
      </div>

      <!-- Change Password -->
      <div class="cyber-card">
        <h3 class="font-semibold text-sm text-brand-primary tracking-wider mb-4">UBAH PASSWORD</h3>
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label class="label-cyber">Password Lama</label>
            <input type="password" v-model="passwordForm.old_password" class="cyber-input" required />
          </div>
          <div>
            <label class="label-cyber">Password Baru</label>
            <input type="password" v-model="passwordForm.new_password" class="cyber-input" required minlength="6" />
          </div>
          <div>
            <label class="label-cyber">Konfirmasi Password Baru</label>
            <input type="password" v-model="passwordForm.confirm_password" class="cyber-input" required />
          </div>
          <button type="submit" class="cyber-btn-primary" :disabled="savingPassword">
            {{ savingPassword ? 'Menyimpan...' : 'Ubah Password' }}
          </button>
        </form>
      </div>
    </div>

    <!-- Account Info -->
    <div class="cyber-card mt-6">
      <h3 class="font-semibold text-sm text-brand-primary tracking-wider mb-4">INFO SISTEM</h3>
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-brand-muted">User ID</p>
          <p class="text-brand-text font-mono">{{ auth.user?.id }}</p>
        </div>
        <div>
          <p class="text-brand-muted">Role</p>
          <p class="text-brand-text capitalize">{{ auth.user?.role?.replace('_', ' ') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuthStore } from '../stores/auth'
import Swal from 'sweetalert2'

const api = useApi()
const auth = useAuthStore()

const profileForm = ref({ nama: '', email: '' })
const passwordForm = ref({ old_password: '', new_password: '', confirm_password: '' })
const savingProfile = ref(false)
const savingPassword = ref(false)

async function updateProfile() {
  savingProfile.value = true
  try {
    await api.put('/auth/profile', { nama: profileForm.value.nama, email: profileForm.value.email })
    // Update local user data
    const user = { ...auth.user, nama: profileForm.value.nama, email: profileForm.value.email }
    auth.setAuth(auth.token, user)
    Swal.fire('Berhasil', 'Profil berhasil diupdate', 'success')
  } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal update', 'error') }
  finally { savingProfile.value = false }
}

async function changePassword() {
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    Swal.fire('Error', 'Konfirmasi password tidak cocok', 'error')
    return
  }
  savingPassword.value = true
  try {
    await api.put('/auth/password', { old_password: passwordForm.value.old_password, new_password: passwordForm.value.new_password })
    passwordForm.value = { old_password: '', new_password: '', confirm_password: '' }
    Swal.fire('Berhasil', 'Password berhasil diubah', 'success')
  } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal ubah password', 'error') }
  finally { savingPassword.value = false }
}

onMounted(async () => {
  try {
    const { data } = await api.get('/auth/me')
    profileForm.value = { nama: data.nama, email: data.email }
  } catch {}
})
</script>

<style scoped>
.label-cyber { @apply block text-xs text-brand-muted uppercase tracking-wider mb-1.5 font-medium; }
</style>
