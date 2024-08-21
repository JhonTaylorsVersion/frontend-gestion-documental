<template>
    <div class="border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800">
        <!-- Columnas, Filas y Búsqueda -->
        <!-- Dropdown Columnas -->
        <div class="relative inline-block text-left">
            <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" data-dropdown-delay="2"
                class="text-sm m-2 p-2 mx-2 px-3 my-2 inline-flex text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                type="button">
                <pre>Columnas</pre>
                <svg class="pt-1 w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 4 4 4-4" />
                </svg>
            </button>
            <div id="dropdown"
                class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-80 h-150 dark:bg-gray-700">
                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                    <li v-for="(header, index) in columns" :key="index"
                        class="flex justify-between hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white"
                        @click="onChangeVisibilityColumn(index)">
                        <span class="block px-4 py-2 ">{{
                            header.head }}</span>
                        <span :class="[
                            `${header.isShowing ? 'text-green-500' : 'text-red-500'}`,
                            `block px-4 py-2`,
                            `hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white`
                        ]">{{ header.isShowing ? 'Visible' : 'Oculto' }}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div>
            <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
                aria-label="Table navigation">
                <!-- Dropdown Filas -->
                <div class="relative inline-block text-left">
                    <span class="font-semibold">Mostrar</span>
                    <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown-2"
                        class="text-sm m-2 p-2 mx-2 px-3 my-2 inline-flex text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        type="button">
                        <pre>{{ lblFilas }}</pre>
                        <svg class="pt-1 w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 10 6">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="m1 1 4 4 4-4" />
                        </svg>
                    </button>
                    <div id="dropdown-2"
                        class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-14 h-150 dark:bg-gray-700">
                        <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                            <li v-for="(item, index) in optionsRowsPerPage" :key="index"
                                class="flex justify-between hover:bg-gray-100 hover:cursor-pointer dark:hover:bg-gray-600 dark:hover:text-white"
                                @click="onChangeVisibilityColumn(index)">
                                <span
                                    class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                    @click="onChangeRowsPerPage(item)">{{ item }}</span>
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
                            <div
                                class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input type="text" @input="search" placeholder="Buscar . . ."
                                class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
                            <th v-for="(head, headIndex) in columns" :key="headIndex" scope="col"
                                :class="`${columns[headIndex].isShowing ? 'px-6 py-2' : ''}`">
                                <div v-show="head.isShowing">
                                    {{ head.head }}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(row, rowIndex) in filteredItems" :key="rowIndex"
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <th v-for="(cell, cellIndex) in Object.values(row ? row : [])" :key="cellIndex" scope="row"
                                :class="[
                                    ` font-medium text-gray-900 whitespace-nowrap dark:text-white`,
                                    `${columns[cellIndex].isShowing ? 'px-6 py-3' : ''}`
                                ]">
                                <div v-if="cell === '' || cell === null" v-show="columns[cellIndex].isShowing">
                                    <button disabled type="button" :class="[
                                        `text-white bg-gray-400 font-medium rounded-lg text-sm px-5 py-2.5 me-2 m-auto max-sm focus:outline-none`,
                                        `${columns[columns.length - 1].isShowing ? 'block' : 'hidden'}`
                                    ]">Abrir</button>
                                </div>
                                <div v-else v-show="columns[cellIndex].isShowing">
                                    <div v-if="columns[cellIndex].head === 'Informe de Similitud' || columns[cellIndex].head === 'SENESCYT' || columns[cellIndex].head === 'BIBLIOTECA PDF' || columns[cellIndex].head === 'BIBLIOTECA DECLARACION'"
                                        v-show="columns[cellIndex].isShowing">
                                        <button @click="openNewWindow(dominio?.trim(), cell)" type="button" :class="[
                                            `text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 m-auto dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none dark:focus:ring-blue-800`,
                                            `${columns[columns.length - 1].isShowing ? 'block' : 'hidden'}`
                                        ]">Abrir</button>
                                    </div>

                                    <div v-else v-show="columns[cellIndex].isShowing">
                                        {{ cell }}
                                    </div>

                                </div>
                            </th>
                            <!-- <th>
                                <button @click="emitRowId(row)" type="button" :class="[
                                    `text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 m-auto dark:bg-blue-600 dark:hover:bg-blue-500 focus:outline-none dark:focus:ring-blue-800`,
                                    `${columns[columns.length - 1].isShowing ? 'block' : 'hidden'}`
                                ]">Editar</button>
                            </th> -->
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Paginación -->
        <div>
            <nav class="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
                aria-label="Table navigation">
                <span
                    class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">Mostrando
                    <span class="font-semibold text-gray-900 dark:text-white">{{ showingNumberStartRowsCurrentPage
                        }}-{{ showingNumberEndRowsCurrentPage }}</span>
                    de
                    <span class="font-semibold text-gray-900 dark:text-white">{{ totalRows }}</span>

                </span>
                <div class="flex flex-col">
                    <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                        <li>
                            <span
                                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                @click="onChangeCurrentPage(1)">Inicio</span>
                        </li>
                        <li>
                            <span
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                @click="onBeforeCurrentPage">Anterior</span>
                        </li>
                        <li v-for="item in getPaginationArray(totalPages)" :key="item">
                            <span :class="[
                                `flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`,
                                `${currentPage == item ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white' : 'bg-white'}`
                            ]" @click="onChangeCurrentPage(item)">{{
                                item }}</span>
                        </li>
                        <li>
                            <span class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border border-gray-300 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
                            " @click="onNextCurrentPage">Siguiente</span>
                        </li>
                        <li>
                            <span
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                @click="onChangeCurrentPage(totalPages)">Fin</span>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { initDropdowns } from 'flowbite';

const dominios = ref('');
const celda = ref('');

const openNewWindow = (dominios: any, celda: any) => {
    const url = `${dominios}${celda}`;
    window.open(url, '_blank');
};

const showList2 = ref(false);
const lblFilas = ref(15);
const toggleList2 = () => {
    showList2.value = !showList2.value;
};
const optionsRowsPerPage = [15, 30, 50, 100, 500]
const rowsPerPage = ref<number>(optionsRowsPerPage[0])
const onChangeRowsPerPage = (rows: number) => {
    rowsPerPage.value = rows
    lblFilas.value = rows;
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

const searchFilter = ref<string>('');

// const filteredItems = computed(() => {
//     const rowsToShow = props.data ? props.data : [];
//     let items = rowsToShow;

//     return items.filter((item: any, index) => {
//         const withinRange = index >= (currentPage.value - 1) * rowsPerPage.value &&
//             index < currentPage.value * rowsPerPage.value;

//         const matchesSearch = Object.values(item).some((value: any) => {
//             return value.toString().toLowerCase().includes(searchFilter.value.toLowerCase());
//         });

//         return matchesSearch && withinRange;
//     });
// });

const filteredItems = computed(() => {
    const rowsToShow: any[] = props.data ? props.data : [];
    
    // Filtrar la data completa primero
    let items = rowsToShow.filter((item) => {
        return Object.values(item).some((value: any) => {
            return value.toString().toLowerCase().includes(searchFilter.value.toLowerCase());
        });
    });

    // Luego aplicar la paginación
    return items.filter((item, index) => {
        const withinRange = index >= (currentPage.value - 1) * rowsPerPage.value &&
            index < currentPage.value * rowsPerPage.value;
        return withinRange;
    });
});

const search = (e: any) => {
    searchFilter.value = e.target.value;
};

const columns = ref<{ head: string; isShowing: boolean }[]>([])
watchEffect(() => {
    if (props.data && props.data.length > 0 && props.data[0]) {
        columns.value = [...Object.keys(props.data[0] as Record<string, unknown>).map((col) => {
            if (col === 'TITU_ID')
                col = 'No.'
            if (col === 'TITU_CEDULA')
                col = 'Cédula'
            if (col === 'TITU_NOMBRES')
                col = 'Nombres'
            if (col === 'CAR_NOMBRE')
                col = 'Carrera'
            if (col === 'TITU_FECHA_DEF')
                col = 'Fecha Defensa'
            if (col === 'MODT_NOMBRE')
                col = 'Trabajo de Titulación'
            if (col === 'TITU_TITULO')
                col = 'Título'
            if (col === 'TITU_SIMILITUD_INF')
                col = 'Informe de Similitud'
            if (col === 'TITU_BIBLIOTECA_SENESCYT')
                col = 'Senescyt'
            if (col === 'TITU_BIBLIOTECA_PDF')
                col = 'Biblioteca PDF'
            if (col === 'TITU_BIBLIOTECA_DECLARACION')
                col = 'Biblioteca Declaracion'
            if (col === 'TITU_BIBLIOTECA_OBSERVACION')
                col = 'Observaciones'
            return { head: col, isShowing: col === 'Informe de Similitud' ? false : col === 'Senescyt' ? false : col === 'Biblioteca PDF' ? false : col === 'Biblioteca Declaracion' ? false : true }
        }),
            // { head: 'EDITAR', isShowing: true }
        ]
    }
})

onMounted(() => {
    initDropdowns();
    if (props.data) {
        columns.value = [...Object.keys(props.data[0] as Record<string, unknown>).map((col) => {
            if (col === 'TITU_ID')
                col = 'No.'
            if (col === 'TITU_CEDULA')
                col = 'Cédula'
            if (col === 'TITU_NOMBRES')
                col = 'Nombres'
            if (col === 'CAR_NOMBRE')
                col = 'Carrera'
            if (col === 'TITU_FECHA_DEF')
                col = 'Fecha Defensa'
            if (col === 'MODT_NOMBRE')
                col = 'Trabajo de Titulación'
            if (col === 'TITU_TITULO')
                col = 'Título'
            if (col === 'TITU_SIMILITUD_INF')
                col = 'Informe de Similitud'
            if (col === 'TITU_BIBLIOTECA_SENESCYT')
                col = 'Senescyt'
            if (col === 'TITU_BIBLIOTECA_PDF')
                col = 'Biblioteca PDF'
            if (col === 'TITU_BIBLIOTECA_DECLARACION')
                col = 'Biblioteca Declaracion'
            if (col === 'TITU_BIBLIOTECA_OBSERVACION')
                col = 'Observaciones'
            // return { head: col, isShowing: true }
            return { head: col, isShowing: col === 'Informe de Similitud' ? false : col === 'Senescyt' ? false : col === 'Biblioteca PDF' ? false : col === 'Biblioteca Declaracion' ? false : true }
        }),
            // { head: 'SENESCYT', isShowing: false }
        ]
    }
})

const onChangeVisibilityColumn = (index: number) => {
    columns.value[index].isShowing = !columns.value[index].isShowing
    console.log(columns.value[index])
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
    return props.data ? ((rowsPerPage.value * (currentPage.value - 1)) + 1) : 0
})
const showingNumberEndRowsCurrentPage = computed(() => {
    if (rowsPerPage.value * currentPage.value > totalRows.value) {
        return totalRows.value
    }
    return props.data ? (rowsPerPage.value * currentPage.value) : 0
})

const getPaginationArray = (arrProp: number) => {
    const arr = Array.from({length: arrProp}, (_, i) => i+ 1)
    const maxLength = 7; // Maximum length of the output array
    const selectedIndex = arr.indexOf(currentPage.value);

    if (selectedIndex === -1) {
        // If the selected number is not found in the array, return an empty array
        return [];
    }

    const startIndex = Math.max(0, selectedIndex - Math.floor((maxLength - 1) / 2));
    const endIndex = Math.min(arr.length, startIndex + maxLength);

    return arr.slice(startIndex, endIndex)
}


const emit = defineEmits(['updateRow'])

const emitRowId = (id: any) => {
    const emitId = Object.values(id)[0]
    emit('updateRow', emitId)
}

</script>

<style scoped></style>