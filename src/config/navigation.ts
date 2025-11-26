// src/config/navigation.ts

export interface NavItem {
  label: string
  to: string
  icon?: string
  roles: string[]
}

export const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    to: '/',
    icon: 'mdi-view-dashboard',
    roles: ['ROLE_ADMIN', 'ROLE_PACIENTE', 'ROLE_MEDICO'],
  },
  {
    label: 'Perfil',
    to: '/perfil',
    icon: 'mdi-account-circle',
    roles: ['ROLE_ADMIN', 'ROLE_PACIENTE', 'ROLE_MEDICO'],
  },
  {
    label: 'Pacientes',
    to: '/pacientes',
    icon: 'mdi-account-multiple',
    roles: ['ROLE_ADMIN', 'ROLE_MEDICO'],
  },
  {
    label: 'Médicos',
    to: '/medicos',
    icon: 'mdi-doctor',
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'Citas',
    to: '/citas',
    icon: 'mdi-calendar',
    roles: ['ROLE_PACIENTE'],
  },
  {
    label: 'Mi Agenda',
    to: '/medico/agenda',
    icon: 'mdi-calendar-text',
    roles: ['ROLE_MEDICO'],
  },
  {
    label: 'Gestión Citas',
    to: '/admin/citas',
    icon: 'mdi-calendar-multiple-check',
    roles: ['ROLE_ADMIN'],
  },
]
