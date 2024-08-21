<template>
  <DashboardLayout>
    <div>
      <h1 class="text-3xl font-bold mb-6 text-[#317eac]">BUSQUEDA RUTAS</h1>
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
      <div v-if="mensaje">
        <p class="text-lg font-semibold mb-4">{{ mensaje }}</p>
      </div>
      <div v-if="datos.length > 0 && !mensaje">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Rutas Asignadas</h2>
          <div class="ml-auto">
            <div class="bg-gray-100 p-4 rounded-lg shadow-md flex items-center space-x-4">
              <span class="text-blue-500 text-xl font-semibold">Rol: {{ rolUsuarioBuscado }}</span>
            </div>
          </div>
        </div>
        <CustomDataTableView :data="datos" />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@/composables/use-api'
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue'
import CustomDataTableView from '../components/CustomDataTableRoutesView.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'

// Definición de tipos
interface UsuarioData {
  USU_ID: number
  usuario: string
  ROL: string // Agregar el campo 'ROL'
  [key: string]: any
}

// Componentes
const usuario = ref<string>('')
const nombreUsuarioBuscado = ref<string>('') // Actualiza el nombre del usuario buscado
const rolUsuarioBuscado = ref<string>('') // Agregar para mostrar el rol del usuario
const datos = ref<UsuarioData[]>([])
const mensaje = ref<string>('')
const userId = ref<number | null>(null)

// Función para buscar usuario y obtener datos relacionados
const buscarUsuario = async () => {
  if (usuario.value.trim() === '') {
    datos.value = []
    mensaje.value = ''
    nombreUsuarioBuscado.value = '' // Limpiar el nombre del usuario buscado
    rolUsuarioBuscado.value = '' // Limpiar el rol del usuario
    return
  }

  const url = `/administracion/user-roles/${usuario.value}`

  try {
    const response = await useApi.get<UsuarioData[]>(url)
    if (response.data.length > 0) {
      datos.value = response.data
      mensaje.value = ''
      nombreUsuarioBuscado.value = response.data[0].usuario // Actualizar el nombre del usuario buscado
      rolUsuarioBuscado.value = response.data[0].ROL // Actualizar el rol del usuario buscado
      userId.value = response.data[0].USU_ID
    } else {
      datos.value = []
      mensaje.value = 'El usuario no existe o no forma parte del staff. Compruebe el nombre del usuario.'
      nombreUsuarioBuscado.value = '' // Limpiar el nombre del usuario buscado
      rolUsuarioBuscado.value = '' // Limpiar el rol del usuario
    }
  } catch (error) {
    console.error('Error al obtener datos:', error)
    datos.value = []
    mensaje.value = 'Error al obtener los datos. Intente nuevamente más tarde.'
    nombreUsuarioBuscado.value = '' // Limpiar el nombre del usuario buscado
    rolUsuarioBuscado.value = '' // Limpiar el rol del usuario
  }
}

// Función para limpiar el campo de entrada y los datos
const clearInput = () => {
  usuario.value = ''
  datos.value = []
  mensaje.value = ''
  userId.value = null
  nombreUsuarioBuscado.value = '' // Limpiar el nombre del usuario buscado
  rolUsuarioBuscado.value = '' // Limpiar el rol del usuario
}
</script>
