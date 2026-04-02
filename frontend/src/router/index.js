import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('../components/layout/MainLayout.vue'),
    meta: { auth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
      { path: 'siswa', name: 'Siswa', component: () => import('../views/SiswaView.vue') },
      { path: 'kelas', name: 'Kelas', component: () => import('../views/KelasView.vue') },
      { path: 'konseling', name: 'Konseling', component: () => import('../views/KonselingView.vue') },
      { path: 'pelanggaran', name: 'Pelanggaran', component: () => import('../views/PelanggaranView.vue') },
      { path: 'jenis-pelanggaran', name: 'JenisPelanggaran', component: () => import('../views/JenisPelanggaranView.vue') },
      { path: 'surat-masuk', name: 'SuratMasuk', component: () => import('../views/SuratMasukView.vue') },
      { path: 'surat-keluar', name: 'SuratKeluar', component: () => import('../views/SuratKeluarView.vue') },
      { path: 'laporan', name: 'Laporan', component: () => import('../views/LaporanView.vue') },
      { path: 'users', name: 'Users', component: () => import('../views/UsersView.vue'), meta: { role: 'admin' } },
      { path: 'profil', name: 'Profil', component: () => import('../views/ProfilView.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.auth && !auth.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && auth.isAuthenticated) {
    next('/dashboard')
  } else if (to.meta.role && auth.user?.role !== to.meta.role) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
