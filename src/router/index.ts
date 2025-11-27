import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// Layout
import MainLayout from '@/layouts/MainLayout.vue'

// Auth
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'

// Dashboard
import DashboardView from '@/views/dashboard/DashboardView.vue'

// Pacientes
import PacientesList from '@/views/pacientes/PacientesList.vue'
import PacienteCreate from '@/views/pacientes/PacienteCreate.vue'
import PacienteEdit from '@/views/pacientes/PacienteEdit.vue'

// Citas
import CitasList from '@/views/citas/CitasList.vue'
import CitaCreate from '@/views/citas/CitaCreate.vue'
import CitaEdit from '@/views/citas/CitaEdit.vue'

// Usuarios
import UsuariosList from '@/views/usuarios/UsuariosList.vue'
import UsuarioCreate from '@/views/usuarios/UsuarioCreate.vue'
import UsuarioEdit from '@/views/usuarios/UsuarioEdit.vue'

// Perfil
import PerfilView from '@/views/perfil/PerfilView.vue'

// Mi Agenda (Médico)
import MedicoAgenda from '@/views/citas/MedicoAgenda.vue'

import AdminCitasList from '@/views/citas/AdminCitasList.vue'

import MedicosList from '@/views/medicos/MedicosList.vue'

import MedicoCreate from '@/views/medicos/MedicoCreate.vue'

import MedicoEdit from '@/views/medicos/MedicoEdit.vue'

import MedicoHorarios from '@/views/medicos/MedicoHorarios.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Rutas públicas
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: false },
    },

    // Rutas protegidas (requeridas para el sistema)
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },

      children: [
        { path: '', name: 'dashboard', component: DashboardView },

        // ---- Pacientes ----
        { path: 'pacientes', name: 'pacientes', component: PacientesList },
        { path: 'pacientes/crear', name: 'pacientes-create', component: PacienteCreate },
        { path: 'pacientes/:id', name: 'pacientes-edit', component: PacienteEdit },

        // ---- Citas ----
        { path: 'citas', name: 'citas', component: CitasList },
        { path: 'citas/crear', name: 'citas-create', component: CitaCreate },
        { path: 'citas/:id', name: 'citas-edit', component: CitaEdit },

        // ---- Usuarios ----
        { path: 'usuarios', name: 'usuarios', component: UsuariosList },
        { path: 'usuarios/crear', name: 'usuarios-create', component: UsuarioCreate },
        { path: 'usuarios/:id', name: 'usuarios-edit', component: UsuarioEdit },

        // ---- Perfil ----
        { path: 'perfil', name: 'perfil', component: PerfilView },

        // ---- Mi Agenda (Médico) ----
        {
          path: 'medico/agenda',
          name: 'medico-agenda',
          component: MedicoAgenda,
          meta: { authorize: ['ROLE_MEDICO'] },
        },

        {
          path: 'admin/citas',
          name: 'admin-citas',
          component: AdminCitasList,
          meta: { authorize: ['ROLE_ADMIN'] },
        },

        // ---- MÉDICOS ----
        {
          path: 'medicos',
          name: 'medicos',
          component: MedicosList,
        },

        {
          path: 'medicos/crear',
          name: 'medicos-create',
          component: MedicoCreate,
        },

        { path: 'medicos/:id', name: 'medicos-edit', component: MedicoEdit },

        {
          path: 'medicos/:id/horarios',
          name: 'medicos-horarios',
          component: MedicoHorarios,
        },
      ],
    },

    // Redirección 404
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// ---- Guard global ----
router.beforeEach((to, _, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (!to.meta.requiresAuth && auth.isAuthenticated && to.path === '/login') {
    return next('/')
  }

  next()
})

export default router
