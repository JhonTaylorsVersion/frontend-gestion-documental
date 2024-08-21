<template>
  <DashboardLayout>
    <div class="p-6 max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-[#317eac]">ASIGNACION</h1>
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
        <h2 class="text-2xl font-bold mb-4">Rutas Asignadas</h2>
        <CustomDataTableView :data="datos" />
        <h2 class="text-2xl font-bold mt-6 mb-4">Programas Asignados</h2>
        <TableProgram :data="programas" />
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '@/composables/use-api'  // Ruta corregida
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue'
import CustomDataTableView from '../components/CustomDataTableRoutesView.vue'
import TableProgram from '../components/TableProgram.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'

// Definición de tipos
interface UsuarioData {
  USU_ID: number;
  [key: string]: any;
}

interface ProgramasData {
  [key: string]: any;
}

// Componentes
const usuario = ref<string>('')
const datos = ref<UsuarioData[]>([])
const programas = ref<ProgramasData[]>([])
const mensaje = ref<string>('')
const userId = ref<number | null>(null)

// Función para buscar usuario y obtener datos relacionados
const buscarUsuario = async () => {
  if (usuario.value.trim() === '') {
    datos.value = []
    programas.value = []
    mensaje.value = ''
    return
  }

  const url = `/administracion/user-roles/${usuario.value}`

  try {
    const response = await useApi.get<UsuarioData[]>(url)
    if (response.data.length > 0) {
      datos.value = response.data
      mensaje.value = ''
      userId.value = response.data[0].USU_ID
      // Verifica que userId no sea null antes de llamar a fetchProgramas
      if (userId.value !== null) {
        fetchProgramas(userId.value)
      }
    } else {
      datos.value = []
      programas.value = []
      mensaje.value = 'El usuario no existe o no forma parte del staff. Compruebe el nombre del usuario.'
    }
  } catch (error) {
    console.error('Error al obtener datos:', error)
    datos.value = []
    programas.value = []
    mensaje.value = 'Error al obtener los datos. Intente nuevamente más tarde.'
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
  datos.value = []
  programas.value = []
  mensaje.value = ''
  userId.value = null
}
</script>
