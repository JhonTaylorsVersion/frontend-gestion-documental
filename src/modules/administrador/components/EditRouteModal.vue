<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 p-4">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto max-h-[80vh] overflow-auto">
      <h3 class="text-lg font-bold mb-4">Editar Ruta</h3>
      <form @submit.prevent="handleSubmit">
        <!-- Nombre de la Ruta -->
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2 text-sm">Nombre de la Ruta</label>
          <input v-model="routeName" type="text" class="p-2 border border-gray-300 rounded w-full text-sm" required />
        </div>

        <!-- Ruta -->
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2 text-sm">Ruta</label>
          <input v-model="routePath" type="text" class="p-2 border border-gray-300 rounded w-full text-sm" required />
        </div>

        <!-- Ruta Padre -->
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2 text-sm">Ruta Padre</label>
          <select v-model="selectedParentRoute" class="p-2 border border-gray-300 rounded w-full text-sm" required>
            <option value="" disabled>Seleccione una Ruta Padre</option>
            <option v-for="ruta in parentRoutes" :key="ruta.name" :value="ruta.name">
              {{ ruta.name }}
            </option>
          </select>
        </div>

        <!-- Componente -->
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2 text-sm">Componente</label>
          <input v-model="componentName" type="text" class="p-2 border border-gray-300 rounded w-full text-sm" required />
        </div>

        <!-- Indexed DB -->
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2 text-sm">Indexed DB</label>
          <select v-model="indexedDbName" class="p-2 border border-gray-300 rounded w-full text-sm" required>
            <option value="" disabled>Seleccione una opción</option>
            <option value="0">No cargar datos BDD</option>
            <option value="1">Cargar Estudiantes</option>
            <option value="2">Cargar Docentes</option>
            <option value="3">Cargar Estudiantes y Docentes</option>
          </select>
        </div>

        <div class="flex justify-end gap-4">
          <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-500 text-white rounded text-sm">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded text-sm">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { rutas as rutasData } from '../dto/myData' // Asegúrate de ajustar la ruta según tu estructura de proyecto

interface Props {
  isOpen: boolean
  route: string | null
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'update', 'updateRoutes'])

const routeName = ref('')
const routePath = ref('')
const selectedParentRoute = ref('')
const componentName = ref('')
const indexedDbName = ref('')

// Cargar las rutas padre inicialmente
const parentRoutes = ref(
  rutasData.filter(ruta => ruta.value === 0)
)
// Datos de rutas
const rutas = ref(rutasData)

// Rellena los campos cuando se seleccione una ruta para editar
watch(
  () => props.route,
  (newRoute) => {
    if (newRoute) {
      const routeData = rutas.value.find(r => r.name === newRoute)
      if (routeData) {
        routeName.value = routeData.name
        routePath.value = routeData.path
        selectedParentRoute.value = routeData.parent
        componentName.value = routeData.component
        indexedDbName.value = routeData.indexedDb
      }
    }
  }
)

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const updatedRoute = {
    name: routeName.value,
    path: routePath.value,
    parent: selectedParentRoute.value,
    component: componentName.value,
    indexedDb: indexedDbName.value
  }

  // Obtener las rutas existentes desde localStorage
  const storedRoutes = localStorage.getItem('rutas')
  let updatedRoutes = storedRoutes ? JSON.parse(storedRoutes) : []

  // Actualizar la ruta en el array de rutas
  updatedRoutes = updatedRoutes.map((route: any) =>
    route.name === props.route ? updatedRoute : route
  )

  // Guardar las rutas actualizadas en localStorage
  localStorage.setItem('rutas', JSON.stringify(updatedRoutes))

  // Emitir el evento para actualizar el componente que muestra las rutas
  emit('updateRoutes')

  emit('update', updatedRoute)
  closeModal()
}

// Cargar rutas desde localStorage al montar el componente
onMounted(() => {
  const storedRoutes = localStorage.getItem('rutas')
  if (storedRoutes) {
    rutas.value = JSON.parse(storedRoutes)
  }
})
</script>

<style scoped>
/* Opcional: Agrega estilos específicos para asegurar que el modal se vea bien en diferentes pantallas */
</style>
