<template>
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
    <div class="bg-white p-4 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[80vh] overflow-auto">
      <h3 class="text-sm font-bold mb-4">Crear Nueva Ruta</h3>
      <form @submit.prevent="handleSubmit">
        <!-- Nombre de la Ruta -->
        <div class="mb-3">
          <label class="block text-gray-700 font-bold mb-2 text-sm">Nombre de la Ruta</label>
          <input v-model="routeName" type="text" class="p-2 border border-gray-300 rounded w-full text-sm" required />
        </div>

        <!-- Ruta -->
        <div class="mb-3">
          <label class="block text-gray-700 font-bold mb-2 text-sm">Ruta</label>
          <input v-model="routePath" type="text" class="p-2 border border-gray-300 rounded w-full text-sm" required />
        </div>

        <!-- Ruta Padre -->
        <div class="mb-3">
          <label class="block text-gray-700 font-bold mb-2 text-sm">Ruta Padre</label>
          <select v-model="selectedParentRoute" class="p-2 border border-gray-300 rounded w-full text-sm" required>
            <option value="" disabled>Seleccione una Ruta Padre</option>
            <option v-for="ruta in parentRoutes" :key="ruta.name" :value="ruta.name">
              {{ ruta.name }}
            </option>
          </select>
        </div>

        <!-- Componente -->
        <div class="mb-3">
          <label class="block text-gray-700 font-bold mb-2 text-sm">Componente</label>
          <input v-model="componentName" type="text" class="p-2 border border-gray-300 rounded w-full text-sm" required />
        </div>

        <!-- Indexed DB -->
        <div class="mb-3">
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
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded text-sm">Crear</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { rutas as rutasData } from '../dto/myData' // Ajusta la ruta según tu estructura de proyecto
import eventBus from '../eventBus' // Ajusta la ruta según tu estructura

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'create'])

const routeName = ref('')
const routePath = ref('')
const selectedParentRoute = ref('')
const componentName = ref('')
const indexedDbName = ref('')

// Cargar las rutas padre inicialmente
const parentRoutes = ref(
  rutasData.filter(ruta => ruta.value === 0)
)

// Sincronizar las rutas con el almacenamiento local
const updateParentRoutesFromLocalStorage = () => {
  const storedRoutes = localStorage.getItem('rutas')
  if (storedRoutes) {
    const storedRutas = JSON.parse(storedRoutes)
    parentRoutes.value = rutasData.filter(ruta => ruta.value === 0)
  }
}

// Ejecutar cuando el modal se abre
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    updateParentRoutesFromLocalStorage()
  }
})

const closeModal = () => {
  emit('close')
}

const handleSubmit = () => {
  const newRoute = {
    name: routeName.value,
    path: routePath.value,
    parent: selectedParentRoute.value,
    component: componentName.value,
    indexedDb: indexedDbName.value
  }

  // Actualizar el array de rutas y guardar en localStorage
  const storedRoutes = localStorage.getItem('rutas')
  const existingRoutes = storedRoutes ? JSON.parse(storedRoutes) : []
  const updatedRoutes = [...existingRoutes, newRoute]
  localStorage.setItem('rutas', JSON.stringify(updatedRoutes))

  emit('create', newRoute)
  eventBus.emit('route-added', newRoute) // Emitir el evento
  closeModal()
}
</script>

<style scoped>
/* Estilos opcionales para asegurar que el modal esté centrado y se vea bien */
</style>
