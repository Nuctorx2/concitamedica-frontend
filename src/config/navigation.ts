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
    label: 'Pacientes',
    to: '/pacientes',
    icon: 'mdi-account-multiple',
    roles: ['ROLE_ADMIN', 'ROLE_MEDICO'],
  },
  {
    label: 'Citas',
    to: '/citas',
    icon: 'mdi-calendar',
    roles: ['ROLE_ADMIN', 'ROLE_PACIENTE', 'ROLE_MEDICO'],
  },
  {
    label: 'Perfil',
    to: '/perfil',
    icon: 'mdi-account-circle',
    roles: ['ROLE_ADMIN', 'ROLE_PACIENTE', 'ROLE_MEDICO'],
  },
  {
    label: 'Usuarios (Admin)',
    to: '/usuarios',
    icon: 'mdi-security',
    roles: ['ROLE_ADMIN'],
  },
]
