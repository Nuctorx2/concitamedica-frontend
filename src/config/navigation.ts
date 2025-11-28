// src/config/navigation.ts

export interface NavItem {
  label: string
  to: string
  icon?: string
  roles: string[]
}

export const navigation: NavItem[] = [
  {
    label: 'menu.dashboard',
    to: '/',
    icon: 'mdi-view-dashboard',
    roles: ['ROLE_ADMIN', 'ROLE_PACIENTE', 'ROLE_MEDICO'],
  },
  {
    label: 'menu.profile',
    to: '/perfil',
    icon: 'mdi-account-circle',
    roles: ['ROLE_ADMIN', 'ROLE_PACIENTE', 'ROLE_MEDICO'],
  },
  {
    label: 'menu.patients',
    to: '/pacientes',
    icon: 'mdi-account-multiple',
    roles: ['ROLE_ADMIN', 'ROLE_MEDICO'],
  },
  {
    label: 'menu.doctors',
    to: '/medicos',
    icon: 'mdi-doctor',
    roles: ['ROLE_ADMIN'],
  },
  {
    label: 'menu.appointments',
    to: '/citas',
    icon: 'mdi-calendar',
    roles: ['ROLE_PACIENTE'],
  },
  {
    label: 'menu.my_agenda',
    to: '/medico/agenda',
    icon: 'mdi-calendar-text',
    roles: ['ROLE_MEDICO'],
  },
  {
    label: 'menu.appointments_management',
    to: '/admin/citas',
    icon: 'mdi-calendar-multiple-check',
    roles: ['ROLE_ADMIN'],
  },
]
