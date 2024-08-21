// myData.ts

//Esta constante sirve para almacenar los datos de los usuarios para el nuevo menu 'ASIGNAR' y 'BUSCAR'
export const usuarios2 = [
  { LDOC_CEDULA: '1234567890', LDOC_NOMBRE: 'Juan Pérez' },
  { LDOC_CEDULA: '0987654321', LDOC_NOMBRE: 'María López' }
]

export const usuarios = ['Usuario 1', 'Usuario 2', 'Usuario 3', 'Usuario 4']

export const roles = ['Administrador', 'Editor', 'Usuario', 'Invitado']

export const rolesRuta = [{ rol: 'Ruta 1' }, { rol: 'Ruta 2' }, { rol: 'Ruta 3' }, { rol: 'Ruta 4' }]

// Definimos rutas con propiedades asociadas
export const rutas = [
  { name: 'Dashboard', value: 0, path: 'dashboard', parent: '', component: 'DashboardComponent', indexedDb: '0' },
  { name: 'Settings', value: 0, path: 'settings', parent: '', component: 'SettingsComponent', indexedDb: '0' },
  { name: 'Profile', value: 0, path: 'profile', parent: '', component: 'ProfileComponent', indexedDb: '0' },
  { name: 'Help', value: 0, path: 'help', parent: '', component: 'HelpComponent', indexedDb: '0' },
  { name: 'User Management', value: 1, path: 'user-management', parent: 'Dashboard', component: 'UserManagementComponent', indexedDb: '1' },
  { name: 'System Settings', value: 2, path: 'system-settings', parent: 'Settings', component: 'SystemSettingsComponent', indexedDb: '2' },
  { name: 'User Profile', value: 3, path: 'user-profile', parent: 'Profile', component: 'UserProfileComponent', indexedDb: '3' },
  { name: 'Help Center', value: 4, path: 'help-center', parent: 'Help', component: 'HelpCenterComponent', indexedDb: '0' }
]

export const getUsuarioData = () => {
  const data = localStorage.getItem('usuarioData')
  return data ? JSON.parse(data) : {}
}

export const saveUsuarioData = (data: Record<string, any>) => {
  localStorage.setItem('usuarioData', JSON.stringify(data))
}
