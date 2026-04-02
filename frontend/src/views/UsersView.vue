<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="font-heading text-xl text-cyber-primary tracking-wider">MANAJEMEN USER</h1>
      <button @click="openModal()" class="cyber-btn-primary">+ Tambah</button>
    </div>

    <SearchFilter v-model:search="search" @refresh="fetchData()">
      <select v-model="filterRole" @change="fetchData()" class="cyber-input w-auto">
        <option value="">Semua Role</option>
        <option value="admin">Admin</option>
        <option value="guru_bk">Guru BK</option>
        <option value="wali_kelas">Wali Kelas</option>
        <option value="siswa">Siswa</option>
      </select>
    </SearchFilter>

    <div class="cyber-card">
      <DataTable :columns="columns" :data="data" :loading="loading" :pagination="pagination" @page-change="fetchData($event)">
        <template #role="{ value }">
          <span class="capitalize">{{ value?.replace('_', ' ') }}</span>
        </template>
        <template #actions="{ row }">
          <div class="flex gap-2">
            <button @click="openModal(row)" class="text-cyber-primary hover:text-cyber-primary/80 text-xs">Edit</button>
            <button @click="handleDelete(row)" class="text-cyber-danger hover:text-cyber-danger/80 text-xs">Hapus</button>
          </div>
        </template>
      </DataTable>
    </div>

    <Modal :show="showModal" :title="editId ? 'Edit User' : 'Tambah User'" @close="showModal = false">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="label-cyber">Nama *</label>
          <input v-model="form.nama" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">Email *</label>
          <input type="email" v-model="form.email" class="cyber-input" required />
        </div>
        <div>
          <label class="label-cyber">Password {{ editId ? '(kosongkan jika tidak diubah)' : '*' }}</label>
          <input type="password" v-model="form.password" class="cyber-input" :required="!editId" />
        </div>
        <div>
          <label class="label-cyber">Role *</label>
          <select v-model="form.role" class="cyber-input" required>
            <option value="admin">Admin</option>
            <option value="guru_bk">Guru BK</option>
            <option value="wali_kelas">Wali Kelas</option>
            <option value="siswa">Siswa</option>
          </select>
        </div>
        <div class="flex gap-3 justify-end pt-2">
          <button type="button" @click="showModal = false" class="cyber-btn-ghost">Batal</button>
          <button type="submit" class="cyber-btn-primary" :disabled="saving">{{ saving ? 'Menyimpan...' : 'Simpan' }}</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import Swal from 'sweetalert2'
import SearchFilter from '../components/ui/SearchFilter.vue'
import DataTable from '../components/ui/DataTable.vue'
import Modal from '../components/ui/Modal.vue'

const api = useApi()

const columns = [
  { key: 'nama', label: 'Nama' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
]

const data = ref([])
const loading = ref(false)
const saving = ref(false)
const search = ref('')
const filterRole = ref('')
const pagination = ref(null)
const showModal = ref(false)
const editId = ref(null)
const form = ref({ nama: '', email: '', password: '', role: 'guru_bk' })

async function fetchData(page = 1) {
  loading.value = true
  try {
    const params = { page, search: search.value, role: filterRole.value }
    const { data: res } = await api.get('/users', { params })
    data.value = res.data
    pagination.value = res.pagination
  } catch { Swal.fire('Error', 'Gagal memuat data', 'error') }
  finally { loading.value = false }
}

function openModal(row = null) {
  if (row) {
    editId.value = row.id
    form.value = { nama: row.nama, email: row.email, password: '', role: row.role }
  } else {
    editId.value = null
    form.value = { nama: '', email: '', password: '', role: 'guru_bk' }
  }
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  try {
    if (editId.value) {
      const payload = { nama: form.value.nama, email: form.value.email, role: form.value.role }
      if (form.value.password) payload.password = form.value.password
      await api.put(`/users/${editId.value}`, payload)
      Swal.fire('Berhasil', 'User berhasil diupdate', 'success')
    } else {
      await api.post('/users', form.value)
      Swal.fire('Berhasil', 'User berhasil dibuat', 'success')
    }
    showModal.value = false
    fetchData()
  } catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal menyimpan', 'error') }
  finally { saving.value = false }
}

async function handleDelete(row) {
  const confirm = await Swal.fire({ title: 'Hapus?', text: `Hapus user ${row.nama}?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ff3366', cancelButtonColor: '#2a2a5e', confirmButtonText: 'Hapus', cancelButtonText: 'Batal' })
  if (confirm.isConfirmed) {
    try { await api.delete(`/users/${row.id}`); Swal.fire('Berhasil', 'User berhasil dihapus', 'success'); fetchData() }
    catch (err) { Swal.fire('Error', err.response?.data?.message || 'Gagal menghapus', 'error') }
  }
}

onMounted(fetchData)
</script>

<style scoped>
.label-cyber { @apply block text-xs text-cyber-muted uppercase tracking-wider mb-1.5 font-heading; }
</style>
