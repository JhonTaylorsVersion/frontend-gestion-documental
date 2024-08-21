<template>
  <DashboardLayout>
    <div>
      <h1 class="text-3xl font-bold mb-6 text-[#317eac]">BUSQUEDA USUARIOS</h1>
      <h2 class="text-2xl font-bold mb-4">Buscar Usuario</h2>
      <form @submit.prevent="buscarUsuario" class="flex items-center mb-4">
        <!-- Campo de entrada con ícono de basurero -->
        <div class="relative flex-1 max-w-sm">
          <input
            type="text"
            id="usuario"
            v-model="usuario"
            class="w-full pr-10 pl-4 py-2 border border-gray-300 rounded transition-colors duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
            placeholder="Ingrese el usuario"
            required
          />
          <!-- Ícono de basurero -->
          <button
            @click="clearInput"
            type="button"
            class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <TrashIcon class="h-5 w-5" />
          </button>
        </div>
        <button
          type="submit"
          class="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded transition-colors duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          Buscar
        </button>
      </form>
      <div v-if="mensaje && !nombreUsuarioBuscado">
        <p class="text-lg font-semibold mb-4">{{ mensaje }}</p>
      </div>
      <div v-if="nombreUsuarioBuscado && programas.length > 0">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Carreras Asignadas</h2>
          <div class="ml-auto">
            <div class="bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4">
              <span class="text-blue-500 text-xl font-semibold">Rol: {{ rolUsuarioBuscado }}</span>
              <button
                @click="toggleModificarRol"
                class="px-3 py-1 bg-gray-200 text-gray-700 font-semibold rounded hover:bg-gray-300 focus:outline-none"
              >
                Modificar
              </button>
              <!-- Botón switch para activar/desactivar rol -->
              <button
                @click="toggleEstadoRol"
                class="ml-4 px-4 py-2 rounded focus:outline-none"
                :class="{
                  'bg-red-500 text-white': rolActivo,
                  'bg-green-500 text-white': !rolActivo
                }"
              >
                {{ rolActivo ? 'Desactivar Rol' : 'Activar Rol' }}
              </button>
            </div>
          </div>
        </div>
        <form @submit.prevent="actualizarRol" v-if="showModificarRol" class="mb-4 flex flex-col items-end space-y-4">
          <div class="flex items-center space-x-4">
            <label for="modificarRol" class="text-gray-700 font-semibold">Modificar Rol:</label>
            <select
              id="modificarRol"
              v-model="rolSeleccionado"
              class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <!-- Placeholder como opción deshabilitada -->
              <option value="" disabled selected>Seleccionar rol</option>
              <option v-for="rol in roles" :key="rol.ROL_ID" :value="rol">
                {{ rol.ROL_NOBRE }}
              </option>
            </select>
            <button
              type="submit"
              class="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              Guardar Cambios
            </button>
          </div>
          <!-- Mensaje de éxito o error -->
          <div v-if="mensaje" class="text-green-500 mt-2">
            <p class="text-lg font-semibold">{{ mensaje }}</p>
          </div>
        </form>

        <!-- Mostramos la tabla de programas directamente -->
        <TableProgram :data="programas" />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/use-api'
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue'
import TableProgram from '../components/TableProgram.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'

// Definición de tipos
interface UsuarioData {
  USU_ID: number
  usuario: string
  ROL: string
  ROL_ESTADO: number // Asumimos que esta propiedad indica el estado del rol
  [key: string]: any
}

interface ProgramasData {
  [key: string]: any
}

interface RolData {
  ROL_ID: number
  ROL_NOBRE: string
}

// Componentes
const usuario = ref<string>('')
const nombreUsuarioBuscado = ref<string>('')
const rolUsuarioBuscado = ref<string>('')
const programas = ref<ProgramasData[]>([])
const mensaje = ref<string>('')
const userId = ref<number | null>(null)
const showModificarRol = ref<boolean>(false)
const rolSeleccionado = ref<RolData | null>(null)
const rolActivo = ref<boolean>(true) // Estado del rol

// Estado para almacenar los roles obtenidos
const roles = ref<RolData[]>([])

// Función para obtener roles
const fetchRoles = async () => {
  try {
    const response = await useApi.get<RolData[]>('/administracion/roles')
    roles.value = response.data
  } catch (error) {
    console.error('Error al obtener roles:', error)
  }
}

// Llamar a fetchRoles cuando el componente se monte
onMounted(() => {
  fetchRoles()
})

// Función para buscar usuario y obtener datos relacionados
const buscarUsuario = async () => {
  if (usuario.value.trim() === '') {
    programas.value = []
    mensaje.value = ''
    nombreUsuarioBuscado.value = ''
    rolUsuarioBuscado.value = ''
    rolActivo.value = true // Resetear el estado del rol
    return
  }

  const url = `/administracion/user-roles/${usuario.value}`

  try {
    const response = await useApi.get<UsuarioData[]>(url)
    if (response.data.length > 0) {
      const usuarioData = response.data[0]
      mensaje.value = ''
      userId.value = usuarioData.USU_ID
      nombreUsuarioBuscado.value = usuarioData.usuario
      rolUsuarioBuscado.value = usuarioData.ROL
      rolActivo.value = usuarioData.ESTADO === 1 // Establece el estado del rol según la columna ESTADO
      if (userId.value !== null) {
        fetchProgramas(userId.value)
      }
    } else {
      programas.value = []
      mensaje.value = 'El usuario no existe o no forma parte del staff. Compruebe el nombre del usuario.'
      nombreUsuarioBuscado.value = ''
      rolUsuarioBuscado.value = ''
      rolActivo.value = true
    }
  } catch (error) {
    console.error('Error al obtener datos:', error)
    programas.value = []
    mensaje.value = 'Error al obtener los datos. Intente nuevamente más tarde.'
    nombreUsuarioBuscado.value = ''
    rolUsuarioBuscado.value = ''
    rolActivo.value = true
  }
}

// Función para obtener datos adicionales de programas
const fetchProgramas = async (id: number) => {
  const url = `/administracion/usuario-carrera/${id}`

  try {
    const response = await useApi.get<ProgramasData[]>(url)
    programas.value = response.data
  } catch (error) {
    console.error('Error al obtener datos adicionales:', error)
  }
}

// Función para limpiar el campo de entrada y los datos
const clearInput = () => {
  usuario.value = ''
  programas.value = []
  mensaje.value = ''
  userId.value = null
  nombreUsuarioBuscado.value = ''
  rolUsuarioBuscado.value = ''
  rolActivo.value = true
}

// Función para alternar la visibilidad del DDL de modificar rol
const toggleModificarRol = () => {
  showModificarRol.value = !showModificarRol.value
}

// Función para actualizar el rol seleccionado
const actualizarRol = async () => {
  if (userId.value !== null && rolSeleccionado.value !== null) {
    const url = `/administracion/actualizar-rol-usuario/${userId.value}`
    try {
      await useApi.put(url, { rolId: rolSeleccionado.value.ROL_ID, estado: 1 })
      mensaje.value = 'Rol actualizado correctamente.'
      rolUsuarioBuscado.value = rolSeleccionado.value.ROL_NOBRE // Actualiza el rol mostrado en la interfaz
    } catch (error) {
      console.error('Error al actualizar rol:', error)
      mensaje.value = 'Error al actualizar el rol. Intente nuevamente más tarde.'
    }
  }
}

// Función para activar/desactivar el rol
const toggleEstadoRol = async () => {
  if (userId.value !== null) {
    // Estado del rol a enviar
    const nuevoEstado = rolActivo.value ? 0 : 1

    // URL del endpoint
    const url = `/administracion/actualizar-rol-usuario/${userId.value}`

    try {
      // Verificamos que rolUsuarioBuscado tiene el ID del rol correcto
      const rolId = roles.value.find((rol) => rol.ROL_NOBRE === rolUsuarioBuscado.value)?.ROL_ID

      if (rolId === undefined) {
        mensaje.value = 'ID de rol no encontrado.'
        return
      }

      // Realizamos la solicitud PUT para actualizar el estado del rol
      await useApi.put(url, { rolId: rolId, estado: nuevoEstado })

      // Actualizamos el estado local del rol
      rolActivo.value = !rolActivo.value
      mensaje.value = `Rol ${rolActivo.value ? 'activado' : 'desactivado'} correctamente.`
    } catch (error) {
      console.error('Error al actualizar estado del rol:', error)
      mensaje.value = 'Error al actualizar el estado del rol. Intente nuevamente más tarde.'
    }
  }
}
</script>
