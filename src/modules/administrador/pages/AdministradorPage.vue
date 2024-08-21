<template>
  <DashboardLayout>
    <!-- Encabezado -->
    <div class="flex flex-col md:flex-row justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold">ADMINISTRACIÓN</h2>
      </div>
    </div>

    <!-- Formulario -->
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h3 class="text-lg font-bold mb-4">Asignar ROL-PRIVILEGIO</h3>
      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Selección de usuarios y campo de búsqueda en fila -->
        <div class="flex flex-col md:flex-row gap-8 col-span-1 md:col-span-4">
          <!-- Selección de Usuarios -->
          <div class="flex flex-col flex-1 md:w-1/2">
            <label class="block text-gray-700 font-bold mb-2">Usuarios</label>
            <select v-model="selectedUsuario" @change="handleUsuarioChange" class="p-2 border border-gray-300 rounded w-full">
              <option value="" disabled>Seleccione un usuario</option>
              <option v-for="usuario in filteredUsuarios" :key="usuario" :value="usuario">
                {{ usuario }}
              </option>
            </select>
          </div>

          <!-- Campo de Búsqueda de Usuarios -->
          <div class="flex flex-col flex-1 md:w-1/2">
            <label class="block text-gray-700 font-bold mb-2">Buscar Usuarios</label>
            <input type="text" v-model="searchQuery" placeholder="Buscar usuario..." class="p-2 border border-gray-300 rounded w-full" />
            <p v-if="searchQuery && filteredUsuarios.length === 0" class="text-red-500 mt-2">No hay coincidencias</p>
            <p v-if="searchQuery && filteredUsuarios.length > 1" class="text-green-500 mt-2">
              Cantidad de coincidencias: {{ filteredUsuarios.length }}
            </p>
          </div>
        </div>

        <!-- Mostrar roles solo si se selecciona un usuario -->
        <template v-if="selectedUsuario">
          <div class="col-span-1 md:col-span-4 flex flex-col md:flex-row gap-8">
            <!-- Recuadro con Información de Roles Habilitados -->
            <div class="order-1 md:order-2 w-full md:w-64 p-4 border border-gray-300 rounded-lg bg-gray-100 max-h-60 overflow-auto text-sm">
              <h4 class="font-bold mb-2">Roles Asignados Al Usuario</h4>
              <div v-if="selectedUsuarioData">
                <div v-if="selectedUsuarioData.roles.length > 0">
                  <ul class="list-disc pl-5">
                    <li v-for="role in selectedUsuarioData.roles" :key="role">{{ role }}</li>
                  </ul>
                </div>
                <div v-else>
                  <p class="text-gray-500">El usuario {{ selectedUsuarioData.nombre }} aún no tiene roles asignados.</p>
                </div>
              </div>
              <div v-else>
                <p class="text-gray-500">Seleccione un usuario para ver los roles asignados.</p>
              </div>
            </div>

            <!-- Recuadro con Rol-Ruta y Rutas Habilitadas -->
            <div class="order-2 md:order-3 w-full md:w-64 p-4 border border-gray-300 rounded-lg bg-gray-100 max-h-60 overflow-auto text-sm">
              <h4 class="font-bold mb-2">Rol-Ruta y Rutas Habilitadas Al Usuario</h4>
              <div v-if="selectedUsuarioData">
                <div v-if="Object.keys(selectedUsuarioData.rolRutas).length > 0">
                  <div v-for="(rutas, rolRuta) in selectedUsuarioData.rolRutas" :key="rolRuta">
                    <h5 class="font-bold mt-2">{{ rolRuta }}, Rutas:</h5>
                    <ul class="list-disc pl-5">
                      <li v-for="ruta in rutas.rutas" :key="ruta">{{ ruta }}</li>
                    </ul>
                  </div>
                </div>
                <div v-else>
                  <p class="text-gray-500">El usuario {{ selectedUsuarioData.nombre }} aún no tiene rol-rutas ni rutas habilitadas.</p>
                </div>
              </div>
              <div v-else>
                <p class="text-gray-500">Seleccione un usuario para ver los rol-rutas y rutas habilitadas.</p>
              </div>
            </div>

            <!-- Cuadro con Roles, Rol-Ruta y Rutas Habilitadas -->
            <div class="order-3 md:order-1 flex-1 flex flex-col gap-6">
              <!-- Contenedor de Roles -->
              <div class="bg-gray-100 p-4 border border-gray-300 rounded-lg max-h-80 overflow-auto">
                <h4 class="text-sm font-bold mb-2">Roles</h4>
                <button type="button" @click="toggleRolesSelection" class="px-2 py-1 bg-blue-500 text-white rounded text-xs mb-2 w-full">
                  {{ allRolesSelected ? 'Desmarcar Todos' : 'Marcar Todos' }}
                </button>
                <div class="flex flex-col gap-2">
                  <div v-for="role in roles" :key="role" class="flex items-center">
                    <input type="checkbox" :id="role" :value="role" v-model="selectedRoles" class="mr-2" />
                    <label :for="role">{{ role }}</label>
                  </div>
                </div>
                <!-- Botón para quitar todos los roles del usuario -->
                <button
                  type="button"
                  @click="removeAllRoles"
                  class="px-2 py-1 bg-red-500 text-white rounded text-xs w-full"
                  :disabled="!selectedUsuario || selectedRoles.length === 0"
                >
                  Quitar Todos los Roles
                </button>
              </div>

              <!-- Contenedor de Rol-Ruta -->
              <div class="bg-gray-100 p-4 border border-gray-300 rounded-lg">
                <h4 class="text-sm font-bold mb-2">Rol-Ruta</h4>
                <select v-model="selectedRolRuta" @change="handleRolRutaChange" class="p-2 border border-gray-300 rounded w-full">
                  <option value="" disabled>Seleccione un Rol-Ruta</option>
                  <option v-for="rolRuta in rolesRuta" :key="rolRuta.rol" :value="rolRuta.rol">
                    {{ rolRuta.rol }}
                  </option>
                </select>
                <div class="flex gap-4 mt-4">
                  <!-- Botón para quitar rutas de un rol-ruta -->
                  <button
                    type="button"
                    @click="removeRoutesFromRolRuta"
                    class="px-2 py-1 bg-green-500 text-white rounded text-xs w-full"
                    :disabled="!selectedRolRuta"
                  >
                    Quitar Rutas del Rol-Ruta
                  </button>
                </div>
              </div>

              <!-- Contenedor de Rutas, visible solo si se ha seleccionado un Rol-Ruta -->
              <template v-if="selectedRolRuta">
                <div class="bg-gray-100 p-4 border border-gray-300 rounded-lg max-h-80 overflow-auto">
                  <h4 class="text-sm font-bold mb-2">Rutas</h4>
                  <button type="button" @click="toggleRutasSelection" class="px-2 py-1 bg-blue-500 text-white rounded text-xs mb-2 w-full">
                    {{ allRutasSelected ? 'Desmarcar Todas' : 'Marcar Todas' }}
                  </button>
                  <div class="flex flex-col gap-2">
                    <div v-for="ruta in filteredRutas" :key="ruta.name" class="flex items-center">
                      <input type="checkbox" :id="ruta.name" :value="ruta.name" v-model="selectedRutas" class="mr-2" />
                      <label :for="ruta.name">{{ ruta.name }}</label>
                    </div>
                  </div>

                  <div class="flex gap-4 mt-4">
                    <button type="button" @click="openCreateRouteModal" class="px-2 py-1 bg-green-500 text-white rounded text-xs w-full">
                      Crear Ruta
                    </button>
                    <button type="button" @click="openEditRouteModal" class="px-2 py-1 bg-yellow-500 text-white rounded text-xs w-full">
                      Editar Ruta
                    </button>
                  </div>
                  <div v-if="showEditError" class="text-red-500 text-xs mt-2">
                    {{ errorMessage }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>

        <!-- Botones de acción -->
        <div class="col-span-1 md:col-span-4 flex flex-col md:flex-row justify-start mt-6 gap-4 items-center">
          <!-- Botón de actualizar -->
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded" :disabled="!selectedUsuario">Actualizar</button>

          <!-- Botón de deshacer cambios -->
          <!--<button type="button" @click="resetForm" class="px-4 py-2 bg-gray-500 text-white rounded">Deshacer Cambios</button>-->

          <!-- Botón de limpiar localStorage -->
          <button type="button" @click="clearLocalStorage" class="px-4 py-2 bg-red-500 text-white rounded">Reiniciar</button>
          <!-- Nota de deshacer cambios -->
          <!-- <p class="text-yellow-500 ml-4">Nota: Solo puede deshacer cambios que aún no se han actualizado.</p> -->
        </div>
      </form>
    </div>
    <CreateRouteModal :isOpen="isCreateRouteModalOpen" @close="closeCreateRouteModal" @create="handleCreateRoute" />
    <EditRouteModal :isOpen="isEditRouteModalOpen" :route="selectedRutas[0]" @close="closeEditRouteModal" @edit="handleEditRoute" />
  </DashboardLayout>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import DashboardLayout from '@/modules/dashboard/layouts/DashboardLayout.vue'
import CreateRouteModal from '../components/CreateRouteModal.vue'
import EditRouteModal from '../components/EditRouteModal.vue'
import { usuarios, roles, rolesRuta, rutas, getUsuarioData, saveUsuarioData } from '@/modules/administrador/dto/myData'
import eventBus from '../eventBus' // Ajusta la ruta según tu estructura

const isCreateRouteModalOpen = ref(false)
const usuarioData = ref(getUsuarioData())
const selectedUsuario = ref<string | null>(null)
const selectedRoles = ref<string[]>([])
const selectedRolRuta = ref<string | null>(null)
const selectedRutas = ref<string[]>([])
const searchQuery = ref<string>('')
const changesMade = ref(false)
const updated = ref(false)
const selectedRouteToEdit = ref(null)
const isEditRouteModalOpen = ref(false)
const initialState = ref<any>({}) // To store initial state
const showEditError = ref(false)
const errorMessage = ref('')
const isModalOpen = ref(false)
const combinedRutas = ref([...rutas]) // Inicializa con las rutas predefinidas
const filteredRutas = ref<{ name: string; value: number; path: string; parent: string; component: string; indexedDb: string }[]>([]) // Rutas filtradas para mostrar en la interfaz

// Función para cargar rutas desde localStorage y combinar con rutas iniciales
const loadRoutes = () => {
  // Cargar rutas desde localStorage
  const storedRoutes = localStorage.getItem('rutas')
  const rutasLocalStorage = storedRoutes ? JSON.parse(storedRoutes) : []

  // Filtrar y combinar rutas
  filteredRutas.value = [
    ...rutas.filter((r: { value: number }) => r.value !== 0),
    ...rutasLocalStorage.filter((r: { value: number }) => r.value !== 0)
  ]
}
// Escuchar el evento para actualizar la lista de rutas
const handleRouteAdded = () => {
  loadRoutes()
}
const filterRutas = () => {
  filteredRutas.value = combinedRutas.value.filter((ruta) => ruta.value !== 0)
}

const editSelectedRoute = () => {
  if (selectedRutas.value.length === 1) {
    const routeToEdit = selectedRutas.value[0]
    console.log('Editando ruta:', routeToEdit)
  } else if (selectedRutas.value.length > 1) {
    alert('Solo puede editar una ruta a la vez.')
  } else {
    alert('Seleccione una ruta para editar.')
  }
}
const removeAllRoles = () => {
  if (selectedUsuario.value) {
    const userConfirmation = confirm('Esta acción no se puede revertir. ¿Está seguro de que desea eliminar todos los roles del usuario?');

    if (userConfirmation) {
      // Obtener los datos del usuario
      const userData = usuarioData.value[selectedUsuario.value];

      if (userData) {
        // Eliminar todos los roles del usuario
        userData.roles = [];

        // Guardar los datos actualizados
        saveUsuarioData(usuarioData.value);
        usuarioData.value = getUsuarioData(); // Actualizar los datos del usuario

        // Limpiar la selección de roles
        selectedRoles.value = [];
        changesMade.value = true;
        alert(`Todos los roles han sido eliminados para el usuario ${selectedUsuario.value}.`);
      }
    } else {
      alert('La eliminación de roles ha sido cancelada.');
    }
  }
};


// Remove routes from selected rol-ruta
const removeRoutesFromRolRuta = () => {
  if (selectedUsuario.value && selectedRolRuta.value) {
    const userConfirmation = confirm('Esta acción no se puede revertir. ¿Está seguro de que desea eliminar todas las rutas de la rol-ruta seleccionada?');

    if (userConfirmation) {
      const userData = usuarioData.value[selectedUsuario.value];
      if (userData && userData.rolRutas[selectedRolRuta.value]) {
        delete userData.rolRutas[selectedRolRuta.value];
        saveUsuarioData(usuarioData.value);
        usuarioData.value = getUsuarioData(); // Actualizar los datos del usuario

        selectedRutas.value = [];
        selectedRolRuta.value = null;
        alert('Las rutas de la rol-ruta seleccionada han sido eliminadas exitosamente.');
      }
    } else {
      alert('La eliminación de rutas ha sido cancelada.');
    }
  }
};

const openEditRouteModal = () => {
  if (selectedRutas.value.length === 0) {
    showEditError.value = true
    errorMessage.value = 'Debe seleccionar una ruta para editar.'
  } else if (selectedRutas.value.length === 1) {
    showEditError.value = false
    isEditRouteModalOpen.value = true
  } else {
    showEditError.value = true
    errorMessage.value = 'Solo puede editar una ruta a la vez.'
  }
}

const closeEditRouteModal = () => {
  isEditRouteModalOpen.value = false
}

const handleEditRoute = (updatedRoute: string) => {
  // Lógica para manejar la edición de rutas
}

const openCreateRouteModal = () => {
  isCreateRouteModalOpen.value = true
}

const closeCreateRouteModal = () => {
  isCreateRouteModalOpen.value = false
}

const handleCreateRoute = (route: any) => {
  console.log('Nueva ruta creada:', route)
}

// Store the initial state of the form
const storeInitialState = () => {
  if (selectedUsuario.value) {
    const userData = usuarioData.value[selectedUsuario.value] || { roles: [], rolRutas: {} }
    initialState.value = {
      roles: [...userData.roles],
      rolRuta: selectedRolRuta.value,
      rutas: [...selectedRutas.value]
    }
  }
}

storeInitialState()

// Computed property to filter usuarios based on search query
const filteredUsuarios = computed(() => {
  if (!searchQuery.value) {
    return usuarios
  }
  return usuarios.filter((usuario) => usuario.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

// Watcher to automatically select user if only one match is found
watch(filteredUsuarios, (newVal) => {
  if (newVal.length === 1) {
    selectedUsuario.value = newVal[0]
    handleUsuarioChange()
  } else {
    selectedUsuario.value = null
  }
})

const clearLocalStorage = () => {
  // Solicitar la contraseña al usuario
  const password = prompt('Por favor, ingrese la contraseña para confirmar la acción:');

  // Contraseña correcta para permitir la acción
  const correctPassword = 'root';

  // Verificar la contraseña ingresada
  if (password === correctPassword) {
    // Limpiar el localStorage y recargar la página
    localStorage.clear();
    location.reload(); // Recargar la página para reflejar los cambios
    alert('El localStorage ha sido limpiado y la página ha sido recargada.');
  } else {
    alert('Contraseña incorrecta. La acción ha sido cancelada.');
  }
};


// Watcher to clear selected RolRuta if no roles are selected
watch(selectedRoles, (newRoles) => {
  if (newRoles.length === 0) {
    selectedRolRuta.value = null
    selectedRutas.value = [] // Clear rutas if no roles are selected
  }
})

// Selected user data to display the current settings
const selectedUsuarioData = computed(() => {
  if (selectedUsuario.value) {
    return usuarioData.value[selectedUsuario.value] || { roles: [], rolRutas: {} }
  }
  return null
})

const handleUsuarioChange = () => {
  if (selectedUsuario.value) {
    const userData = usuarioData.value[selectedUsuario.value] || { roles: [], rolRutas: {} }
    selectedRoles.value = [...userData.roles]
    selectedRolRuta.value = null
    selectedRutas.value = []
    changesMade.value = false
    updated.value = false
    storeInitialState()
  }
}

const handleRolRutaChange = () => {
  if (selectedRolRuta.value && selectedUsuario.value) {
    const userData = usuarioData.value[selectedUsuario.value]
    const rolRutaData = userData.rolRutas[selectedRolRuta.value] || { rutas: [] }
    selectedRutas.value = rolRutaData.rutas
    changesMade.value = false
    updated.value = false
  }
}

const toggleRolesSelection = () => {
  if (allRolesSelected.value) {
    selectedRoles.value = []
  } else {
    selectedRoles.value = [...roles]
  }
  changesMade.value = true
}

const toggleRutasSelection = () => {
  // Obtener todas las rutas, incluyendo las de localStorage
  const storedRoutes = localStorage.getItem('rutas')
  const rutasLocalStorage = storedRoutes ? JSON.parse(storedRoutes) : []
  
  // Combinar rutas iniciales y rutas de localStorage
  const allRoutes = [
    ...rutas.filter(r => r.value !== 0),
    ...rutasLocalStorage.filter((r: { value: number }) => r.value !== 0)
  ]

  if (allRutasSelected.value) {
    selectedRutas.value = [] // Desmarcar todas las rutas
  } else {
    selectedRutas.value = allRoutes.map((r: any) => r.name) // Marcar todas las rutas
  }

  changesMade.value = true
}



// Escuchar el evento para actualizar la lista de rutas
const handleRouteUpdate = () => {
  loadRoutes()
}
onMounted(() => {
  loadRoutes()
  eventBus.on('updateRoutes', handleRouteUpdate)
})
// Llamar a la función al montar el componente
onMounted(() => {
  loadRoutes()
  eventBus.on('route-added', handleRouteAdded)
})
const submitForm = () => {
  // Validar que haya al menos un rol o una rol-ruta seleccionada
  if (selectedRoles.value.length === 0 && (!selectedRolRuta.value || selectedRutas.value.length === 0)) {
    alert('Debe seleccionar al menos un rol o una rol-ruta con rutas antes de actualizar.');
    return;
  }

  // Crear objeto de Rol-Rutas actualizado
  const updatedRolRutas: { [key: string]: { rutas: string[] } } = {};

  // Si hay una Rol-Ruta seleccionada y tiene rutas
  if (selectedRolRuta.value && selectedRutas.value.length > 0) {
    updatedRolRutas[selectedRolRuta.value] = { rutas: selectedRutas.value };
  }

  // Si hay un usuario seleccionado, actualizar los datos
  if (selectedUsuario.value) {
    const updatedData = {
      ...usuarioData.value,
      [selectedUsuario.value]: {
        roles: selectedRoles.value,
        rolRutas: {
          ...usuarioData.value[selectedUsuario.value]?.rolRutas,
          ...updatedRolRutas,
        },
      },
    };

    // Guardar los datos actualizados del usuario
    saveUsuarioData(updatedData);
    usuarioData.value = getUsuarioData();
    changesMade.value = false;
    updated.value = true;

    alert(`Datos de ${selectedUsuario.value} actualizados exitosamente.`);
  }
};


/*
const resetForm = () => {
  if (selectedUsuario.value) {
    if (confirm('¿Estás seguro de que deseas deshacer los cambios?')) {
      const userInitialData = initialState.value
      selectedRoles.value = [...userInitialData.roles]
      selectedRolRuta.value = userInitialData.rolRuta
      selectedRutas.value = [...userInitialData.rutas]
      changesMade.value = false
    }
  }
}
*/

// Computed properties
const allRolesSelected = computed(() => {
  return roles.length > 0 && selectedRoles.value.length === roles.length
})

const allRutasSelected = computed(() => {
  // Obtener todas las rutas, incluyendo las de localStorage
  const storedRoutes = localStorage.getItem('rutas')
  const rutasLocalStorage = storedRoutes ? JSON.parse(storedRoutes) : []

  // Combinar rutas iniciales y rutas de localStorage
  const allRoutes = [
    ...rutas.filter(r => r.value !== 0),
    ...rutasLocalStorage.filter((r: { value: number }) => r.value !== 0)
  ]

  return allRoutes.length > 0 && selectedRutas.value.length === allRoutes.length
})

</script>