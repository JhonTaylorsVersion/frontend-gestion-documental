<template>
  <div class="border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800">
    <!-- Columnas, Filas y Búsqueda -->
    <!-- Dropdown Columnas -->
    <div class="relative inline-block text-left">
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        data-dropdown-delay="2"
        class="text-sm m-2 p-2 mx-2 px-3 my-2 inline-flex text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="button"
      >
        <pre>Columnas</pre>
        <svg class="pt-1 w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      <div id="dropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-80 h-150 dark:bg-gray-700">
        <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
          <li
            v-for="(header, index) in filteredColumns"
            :key="index"
            class="flex justify-between hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white"
            @click="onChangeVisibilityColumn(index)"
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

    <div>
      <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4" aria-label="Table navigation">
        <!-- Dropdown Filas -->
        <div class="relative inline-block text-left">
          <span class="font-semibold">Mostrar</span>
          <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown-2"
            class="text-sm m-2 p-2 mx-2 px-3 my-2 inline-flex text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="button"
          >
            <pre>{{ lblFilas }}</pre>
            <svg class="pt-1 w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          <div id="dropdown-2" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-14 h-150 dark:bg-gray-700">
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li
                v-for="(item, index) in optionsRowsPerPage"
                :key="index"
                class="flex justify-between hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white"
                @click="onChangeRowsPerPage(item)"
              >
                <span class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                  {{ item }}
                </span>
              </li>
            </ul>
          </div>
          <span class="font-semibold">Entradas</span>
        </div>
        <!-- Input de busqueda -->
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
                @input="search"
                placeholder="Buscar nombre . . ."
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
          <thead class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <!-- Columna de numeración -->
              <th v-if="columns[0].isShowing" class="px-6 py-2">N.º</th>
              <th
                v-for="(header, headIndex) in columns.slice(1)"
                :key="headIndex"
                scope="col"
                :class="`${header.isShowing ? 'px-6 py-2' : ''}`"
                @click="onSortByColumn(header.head)"
                class="cursor-pointer"
              >
                <div v-show="header.isShowing">
                  {{ header.head }}
                  <span v-if="sortColumn === header.head">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(row, rowIndex) in filteredItems"
              :key="rowIndex"
              class="font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              <!-- Columna de numeración -->
              <td v-if="columns[0].isShowing" class="px-6 py-3">{{ (currentPage - 1) * rowsPerPage + rowIndex + 1 }}</td>
              <td
                v-for="(header, cellIndex) in columns.slice(1)"
                :key="cellIndex"
                :class="[`font-medium text-gray-900 whitespace-nowrap dark:text-white`, `${header.isShowing ? 'px-6 py-3' : ''}`]"
              >
                <div v-show="header.isShowing">
                  <!-- Columna EDITAR con botón de alternar estado -->
                  <template v-if="header.head === 'ESTADO'">
                    <button
                      @click="toggleStatus(row)"
                      type="button"
                      :class="[
                        row['ESTADO'] === 1 ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700',
                        'text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 m-auto focus:outline-none'
                      ]"
                    >
                      {{ row['ESTADO'] === 1 ? 'Asignado' : 'Desasignado' }}
                    </button>
                  </template>
                  <!-- Otras celdas -->
                  <template v-else>
                    {{ Object.values(row)[cellIndex] }}
                  </template>
                </div>
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
          <span class="font-semibold text-gray-900 dark:text-white"
            >{{ showingNumberStartRowsCurrentPage }}-{{ showingNumberEndRowsCurrentPage }}</span
          >
          de
          <span class="font-semibold text-gray-900 dark:text-white">{{ totalRows }}</span>
        </span>
        <div class="flex flex-col">
          <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <span
                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="onChangeCurrentPage(1)"
                >Inicio</span
              >
            </li>
            <li>
              <span
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="onBeforeCurrentPage"
                >Anterior</span
              >
            </li>
            <li v-for="item in getPaginationArray(totalPages)" :key="item">
              <span
                :class="[
                  `flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`,
                  `${currentPage === item ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white' : 'bg-white'}`
                ]"
                @click="onChangeCurrentPage(item)"
              >
                {{ item }}
              </span>
            </li>
            <li>
              <span
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="onNextCurrentPage"
                >Siguiente</span
              >
            </li>
            <li>
              <span
                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                @click="onChangeCurrentPage(totalPages)"
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

// Refs para manejar los datos y la paginación
const dominios = ref('')
const celda = ref('')

const openNewWindow = (dominios: any, celda: any) => {
  const url = `${dominios}${celda}`
  window.open(url, '_blank')
}

const showList2 = ref(false)
const lblFilas = ref(15)
const toggleList2 = () => {
  showList2.value = !showList2.value
}
const optionsRowsPerPage = [15, 30, 50, 100, 500]
const rowsPerPage = ref<number>(optionsRowsPerPage[0])
const onChangeRowsPerPage = (rows: number) => {
  rowsPerPage.value = rows
  lblFilas.value = rows
}

const props = defineProps({
  data: {
    type: Array,
    required: false
  },
  dominio: {
    type: String,
    required: false
  }
})

const searchFilter = ref<string>('')

// Variables para ordenar
const sortColumn = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

// Filtrar y ordenar los datos
const filteredItems = computed(() => {
  const rowsToShow: any[] = props.data ? props.data : []

  // Filtrar la data completa primero
  let items = rowsToShow.filter((item) => {
    return Object.values(item).some((value: any) => {
      return value.toString().toLowerCase().includes(searchFilter.value.toLowerCase())
    })
  })

  // Ordenar los datos
  if (sortColumn.value) {
    items.sort((a, b) => {
      const aValue = sortColumn.value ? a[sortColumn.value] : null
      const bValue = sortColumn.value ? b[sortColumn.value] : null

      if (aValue == null || bValue == null) return 0

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder.value === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return sortOrder.value === 'asc' ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
    })
  }

  // Luego aplicar la paginación
  return items.filter((item, index) => {
    const withinRange = index >= (currentPage.value - 1) * rowsPerPage.value && index < currentPage.value * rowsPerPage.value
    return withinRange
  })
})

const search = (e: any) => {
  searchFilter.value = e.target.value
}

// Usamos directamente las columnas tal como vienen del endpoint
const columns = ref<{ head: string; isShowing: boolean }[]>([])

watchEffect(() => {
  if (props.data && props.data.length > 0 && props.data[0]) {
    columns.value = [
      { head: 'N.º', isShowing: true },
      ...Object.keys(props.data[0] as Record<string, unknown>).map((col, index) => {
        return {
          head: col,
          isShowing: index !== 0 // Ocultar la primera columna
        }
      })
    ]
  }
})

onMounted(() => {
  initDropdowns() // Inicializa los dropdowns si es necesario

  if (props.data) {
    columns.value = [
      { head: 'N.º', isShowing: true },
      ...Object.keys(props.data[0] as Record<string, unknown>).map((col, index) => {
        return {
          head: col,
          isShowing: !['usuario', 'ROL', 'USU_ID'].includes(col) // Ocultar columnas específicas por defecto
        }
      })
    ]
  }
})



const onSortByColumn = (columnName: string) => {
  if (sortColumn.value === columnName) {
    // Si la columna ya está siendo ordenada, cambiar el orden
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Si es una nueva columna, ordenar ascendente
    sortColumn.value = columnName
    sortOrder.value = 'asc'
  }
}

const onChangeCurrentPage = (page: number) => {
  currentPage.value = page
}
const onBeforeCurrentPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
const onNextCurrentPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const currentPage = ref<number>(1)
const totalPages = computed(() => {
  return Math.ceil(props.data ? props.data.length / rowsPerPage.value : 0)
})
const totalRows = computed(() => {
  return props.data ? props.data.length : 0
})
const showingNumberStartRowsCurrentPage = computed(() => {
  return props.data ? rowsPerPage.value * (currentPage.value - 1) + 1 : 0
})
const showingNumberEndRowsCurrentPage = computed(() => {
  if (rowsPerPage.value * currentPage.value > totalRows.value) {
    return totalRows.value
  }
  return props.data ? rowsPerPage.value * currentPage.value : 0
})

const getPaginationArray = (arrProp: number) => {
  const arr = Array.from({ length: arrProp }, (_, i) => i + 1)
  const maxLength = 7 // Longitud máxima del array de salida
  const selectedIndex = arr.indexOf(currentPage.value)

  if (selectedIndex === -1) {
    // Si el número seleccionado no se encuentra en el array, devuelve un array vacío
    return []
  }

  const startIndex = Math.max(0, selectedIndex - Math.floor((maxLength - 1) / 2))
  const endIndex = Math.min(arr.length, startIndex + maxLength)

  return arr.slice(startIndex, endIndex)
}

const emit = defineEmits(['updateRow'])

const emitRowId = (id: any) => {
  const emitId = Object.values(id)[0]
  emit('updateRow', emitId)
}
const toggleStatus = (row: any) => {
  // Cambia el valor de 'EDITAR' entre 1 y 0
  row['ESTADO'] = row['ESTADO'] === 1 ? 0 : 1

  // Opcional: Actualiza el estado en el backend
  // Por ejemplo, podrías hacer una solicitud HTTP a tu servidor aquí
  // ActualizarEstadoEnServidor(row);

  // Emitir un evento para notificar que el estado ha cambiado
  emitRowId(row['ID'])
}
// Filtrar columnas para el dropdown
const filteredColumns = computed(() => {
  return columns.value.filter(header => !['usuario', 'ROL', 'USU_ID'].includes(header.head));
});

// Función para cambiar la visibilidad de la columna
const onChangeVisibilityColumn = (index: number) => {
  const column = filteredColumns.value[index];
  column.isShowing = !column.isShowing;
};
</script>
