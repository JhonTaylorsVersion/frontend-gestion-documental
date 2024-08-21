<template>
  <div class="border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800">
    <!-- Columnas, Filas y Búsqueda -->
    <!-- Dropdown Columnas -->
    <div class="flex justify-between items-center">
      <div class="relative inline-block text-left">
        <button
          id="dropdownColumnsButton"
          data-dropdown-toggle="dropdownColumns"
          data-dropdown-delay="2"
          class="text-sm m-2 p-2 mx-2 px-3 my-2 inline-flex text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="button"
        >
          <pre>Columnas</pre>
          <svg class="pt-1 w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>
        <div id="dropdownColumns" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-80 h-150 dark:bg-gray-700">
          <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
            <li
              v-for="(header, index) in visibleColumns"
              :key="index"
              class="flex justify-between hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white"
              @click="toggleColumnVisibility(index)"
            >
              <span class="block px-4 py-2">{{ header.head }}</span>
              <span
                :class="[
                  `${header.isShowing ? 'text-green-500' : 'text-red-500'}`,
                  `block px-4 py-2`,
                  `hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`
                ]"
                >{{ header.isShowing ? 'Visible' : 'Oculto' }}</span
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="relative inline-block text-right m-2">
  <button
    class="text-sm p-3 px-5 bg-blue-500 text-white rounded-lg border-2 border-transparent shadow-lg ring-blue-500 ring-opacity-20 ring-offset-2 hover:bg-blue-700 hover:shadow-xl focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 transition-transform transform hover:scale-105 focus:scale-105"
  >
    Asignar
  </button>
</div>

    </div>


    <div>
      <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
        <!-- Dropdown Filas -->
        <div class="relative inline-block text-left">
          <span class="font-semibold">Mostrar</span>
          <button
            id="dropdownRowsButton"
            data-dropdown-toggle="dropdownRows"
            class="text-sm m-2 p-2 mx-2 px-3 my-2 inline-flex text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="button"
          >
            <pre>{{ rowsPerPageLabel }}</pre>
            <svg class="pt-1 w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          <div id="dropdownRows" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-14 h-150 dark:bg-gray-700">
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li
                v-for="(item, index) in rowsPerPageOptions"
                :key="index"
                class="flex justify-between hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white"
                @click="updateRowsPerPage(item)"
              >
                <span class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  {{ item }}
                </span>
              </li>
            </ul>
          </div>
          <span class="font-semibold">Entradas</span>
        </div>
        <!-- Input de búsqueda -->
        <div class="flex flex-col">
          <form class="px-1">
            <label class="sr-only">Búsqueda</label>
            <div class="relative w-full">
              <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                @input="updateFilterText"
                placeholder="Buscar carrera . . ."
                class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>
          </form>
        </div>
      </nav>
    </div>

    <!-- Tabla -->
    <div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg py-2">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <!-- Encabezado de numeración -->
              <th v-if="columns[0].isShowing" class="px-6 py-2">N.º</th>
              <!-- Encabezado de la tabla con botones si la columna está vacía o nula -->
              <th
                v-for="(header, headIndex) in columns.slice(1)"
                :key="headIndex"
                scope="col"
                :class="header.isShowing ? 'px-6 py-2' : 'hidden'"
              >
                <div v-show="header.isShowing">
                  {{ header.head }}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(user, index) in filteredItems"
              :key="user.CAR_ID"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <!-- Columna de numeración -->
              <td v-if="columns[0].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ (currentPage - 1) * currentRowsPerPage + index + 1 }}
              </td>
              <!-- Las demás columnas -->
              <td v-if="columns[1].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ user.USUCP_ID }}
              </td>
              <td v-if="columns[2].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ user.USU_ID }}
              </td>
              <td v-if="columns[3].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ user.CAR_ID }}
              </td>
              <td v-if="columns[4].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ user.CAR_NOMBRE }}
              </td>
              <td v-if="columns[5].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ user.CAR_CARRERA }}
              </td>
              <td v-if="columns[6].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ getPadreNombre(user.CAR_PADREESC ?? 0) }}
              </td>
              <td v-if="columns[7].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ user.CAR_PADREESC }}
              </td>
              <td v-if="columns[8].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <span
                  v-if="user.CAR_ACTIVA === 'SÍ'"
                  class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-500"
                  title="SÍ"
                ></span>
                <span
                  v-if="user.CAR_ACTIVA === 'No'"
                  class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500"
                  title="No"
                ></span>
                <span
                  v-if="user.CAR_ACTIVA !== 'SÍ' && user.CAR_ACTIVA !== 'No'"
                  class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-400"
                  title="Desconocido"
                ></span>
              </td>
              <td v-if="columns[9].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {{ user.CAR_ACTIVA_ESCUELA }}
              </td>
              <td v-if="columns[10].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <span v-if="user.USUCP_TITULACION === 1" class="text-green-500">✓</span>
                <span v-else class="text-red-500">✘</span>
              </td>
              <td v-if="columns[11].isShowing" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <button
                  @click="toggleAssignment(user)"
                  type="button"
                  :class="[
                    user.USUCP_EDITAR === 1 ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700',
                    'text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 m-auto focus:outline-none'
                  ]"
                >
                  {{ user.USUCP_EDITAR === 1 ? 'Asignado' : 'Desasignado' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div>
      <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
        <span class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto"
          >Mostrando
          <span class="font-semibold text-gray-900 dark:text-white">{{ startRowNumber }}-{{ endRowNumber }}</span>
          de
          <span class="font-semibold text-gray-900 dark:text-white">{{ totalDataRows }}</span>
        </span>
        <div class="flex flex-col">
          <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <span
                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="setCurrentPage(1)"
                >Inicio</span
              >
            </li>
            <li>
              <span
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="goToPreviousPage"
                >Anterior</span
              >
            </li>
            <li v-for="item in generatePaginationArray(totalPageCount)" :key="item">
              <span
                :class="[
                  `flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`,
                  `${currentPage === item ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white' : 'bg-white'}`
                ]"
                @click="setCurrentPage(item)"
              >
                {{ item }}
              </span>
            </li>
            <li>
              <span
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="goToNextPage"
                >Siguiente</span
              >
            </li>
            <li>
              <span
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="setCurrentPage(totalPageCount)"
                >Fin</span
              >
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { initDropdowns } from 'flowbite'
import type { DataRow, Props } from '../ProgramTypes'

// Refs para manejar los datos y la paginación
const domainUrl = ref('')
const cellIdentifier = ref('')

const openInNewWindow = (domain: any, cell: any) => {
  const url = `${domain}${cell}`
  window.open(url, '_blank')
}

const isListVisible = ref(false)
const rowsPerPageLabel = ref(15)
const toggleListVisibility = () => {
  isListVisible.value = !isListVisible.value
}
const rowsPerPageOptions = [15, 30, 50, 100, 500]
const currentRowsPerPage = ref<number>(rowsPerPageOptions[0])
const updateRowsPerPage = (rows: number) => {
  currentRowsPerPage.value = rows
  rowsPerPageLabel.value = rows
}

// Define las propiedades utilizando la interfaz Props
const props = defineProps<Props>()

const filterText = ref<string>('')

const filteredItems = computed(() => {
  // Obtén los usuarios filtrados
  const usersToShow = filteredUsers.value

  // Aplica la paginación
  return usersToShow.filter((item, index) => {
    const withinRange = index >= (currentPage.value - 1) * currentRowsPerPage.value && index < currentPage.value * currentRowsPerPage.value
    return withinRange
  })
})

const updateFilterText = (e: any) => {
  filterText.value = e.target.value
}

const columns = ref<{ head: string; key: string; isShowing: boolean }[]>([])

onMounted(() => {
  initDropdowns() // Inicializa los dropdowns si es necesario

  if (props.data && props.data.length > 0 && props.data[0]) {
    columns.value = [
      { head: 'N.º', key: 'index', isShowing: true }, // Columna de numeración
      ...Object.keys(props.data[0] as Record<string, unknown>).map((col) => {
        let displayName = ''
        let isShowing = true

        switch (col) {
          case 'USUCP_ID':
            displayName = 'ID USUARIO CARRERA'
            isShowing = false
            break
          case 'USU_ID':
            displayName = 'ID Usuario'
            isShowing = false
            break
          case 'CAR_ID':
            displayName = 'ID Carrera'
            isShowing = false
            break
          case 'CAR_NOMBRE':
            displayName = 'Nombre Carrera'
            isShowing = true
            break
          case 'CAR_CARRERA':
            displayName = 'Carrera'
            isShowing = false
            break
          case 'CAR_ESCUELA':
            displayName = 'Escuela'
            isShowing = true
            break
          case 'CAR_PADREESC':
            displayName = 'Padre Escuela'
            isShowing = false
            break
          case 'CAR_ACTIVA':
            displayName = 'Activa'
            isShowing = true
            break
          case 'CAR_ACTIVA_ESCUELA':
            displayName = 'Activa Escuela'
            isShowing = false
            break
          case 'USUCP_TITULACION':
            displayName = 'Titulación'
            isShowing = true
            break
          case 'USUCP_EDITAR':
            displayName = 'Acción'
            isShowing = true
            break
          default:
            displayName = col
            isShowing = true
            break
        }

        return { head: displayName, key: col, isShowing }
      })
    ]
  }
})

watchEffect(() => {
  if (props.data && props.data.length > 0 && props.data[0]) {
    columns.value = [
      { head: 'N.º', key: 'index', isShowing: true }, // Columna de numeración
      ...Object.keys(props.data[0] as Record<string, unknown>).map((col) => {
        let displayName = ''
        let isShowing = true

        switch (col) {
          case 'USUCP_ID':
            displayName = 'ID USUARIO CARRERA'
            isShowing = false
            break
          case 'USU_ID':
            displayName = 'ID Usuario'
            isShowing = false
            break
          case 'CAR_ID':
            displayName = 'ID Carrera'
            isShowing = false
            break
          case 'CAR_NOMBRE':
            displayName = 'Nombre Carrera'
            isShowing = true
            break
          case 'CAR_CARRERA':
            displayName = 'Carrera'
            isShowing = false
            break
          case 'CAR_ESCUELA':
            displayName = 'Escuela'
            isShowing = true
            break
          case 'CAR_PADREESC':
            displayName = 'Padre Escuela'
            isShowing = false
            break
          case 'CAR_ACTIVA':
            displayName = 'Activa'
            isShowing = true
            break
          case 'CAR_ACTIVA_ESCUELA':
            displayName = 'Activa Escuela'
            isShowing = false
            break
          case 'USUCP_TITULACION':
            displayName = 'Titulación'
            isShowing = true
            break
          case 'USUCP_EDITAR':
            displayName = 'Acción'
            isShowing = true
            break
          default:
            displayName = col
            isShowing = true
            break
        }

        return { head: displayName, key: col, isShowing }
      })
    ]
  }
})

const blockedColumns = ['ID USUARIO CARRERA', 'ID Usuario', 'ID Carrera', 'Carrera', 'Padre Escuela', 'Activa Escuela']

const visibleColumns = computed(() => {
  return columns.value.filter((column) => !blockedColumns.includes(column.head))
})
const toggleColumnVisibility = (index: number) => {
  // Obtén la columna visible en base al índice
  const column = visibleColumns.value[index]

  if (column) {
    // Encuentra el índice de la columna en el array original
    const originalIndex = columns.value.findIndex((col) => col.head === column.head)
    if (originalIndex !== -1 && !blockedColumns.includes(column.head)) {
      columns.value[originalIndex].isShowing = !columns.value[originalIndex].isShowing
    }
  }
}

const setCurrentPage = (page: number) => {
  currentPage.value = page
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPageCount.value) {
    currentPage.value++
  }
}

const currentPage = ref<number>(1)
const totalPageCount = computed(() => {
  return Math.ceil(props.data ? props.data.length / currentRowsPerPage.value : 0)
})
const totalDataRows = computed(() => {
  return props.data ? props.data.length : 0
})
const startRowNumber = computed(() => {
  return props.data ? currentRowsPerPage.value * (currentPage.value - 1) + 1 : 0
})
const endRowNumber = computed(() => {
  return props.data && currentRowsPerPage.value * currentPage.value > totalDataRows.value
    ? totalDataRows.value
    : props.data
      ? currentRowsPerPage.value * currentPage.value
      : 0
})

const generatePaginationArray = (totalPages: number) => {
  const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1)
  const maxLength = 7
  const currentPageIndex = pageArray.indexOf(currentPage.value)

  if (currentPageIndex === -1) return []

  const startIndex = Math.max(0, currentPageIndex - Math.floor((maxLength - 1) / 2))
  const endIndex = Math.min(pageArray.length, startIndex + maxLength)

  return pageArray.slice(startIndex, endIndex)
}

const emit = defineEmits(['updateRowId'])

const emitRowId = (id: any) => {
  const rowId = Object.values(id)[0]
  emit('updateRowId', rowId)
}

const openEditDialog = (row: DataRow) => {
  // Aquí puedes manejar la lógica para abrir el modal de edición o realizar la acción de edición
  console.log('Abrir modal de edición para:', row)
}

const filteredUsers = computed(() => {
  const searchTerm = filterText.value.toLowerCase()
  return props.data.filter(
    (user) =>
      user.CAR_CARRERA === 1 &&
      (user.CAR_NOMBRE?.toString().toLowerCase().includes(searchTerm) ||
        user.CAR_CARRERA?.toString().toLowerCase().includes(searchTerm) ||
        user.CAR_ACTIVA?.toString().toLowerCase().includes(searchTerm))
  )
})

const getPadreNombre = (padreId: number) => {
  const padre = props.data.find((padre) => padre.CAR_ID === padreId)
  return padre ? padre.CAR_NOMBRE : 'N/A'
}

const toggleAssignment = (user: DataRow) => {
  // Cambia el valor de USUCP_EDITAR entre 1 y 0
  user.USUCP_EDITAR = user.USUCP_EDITAR === 1 ? 0 : 1

  // Actualiza el estado local si es necesario
  // Si estás usando un servidor para guardar estos cambios, realiza una llamada aquí

  // Por ejemplo, podrías emitir un evento para notificar que el estado ha cambiado
  emitRowId(user.USUCP_ID)

  // O podrías llamar a una función para hacer una solicitud HTTP a tu servidor
  // ActualizarEstadoEnServidor(user);
}
</script>
