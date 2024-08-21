// composables/UseIndexedDBPersonal.ts
import { ref } from 'vue';
import { searchPersonal } from '@/indexed-db/personal-db';
import type { GlobalPersonalResponse } from '@/indexed-db/interfaces/global-personal-response';

export function useStudentSearch() {
  const studentData = ref<GlobalPersonalResponse | null>(null);
  const error = ref<string | null>(null);

  const searchStudent = async (identificacion: string) => {
    try {
      const results = await searchPersonal(identificacion);
      if (results.length > 0) {
        studentData.value = results[0]; // Asume que la búsqueda devuelve un solo resultado
      } else {
        studentData.value = null;
        error.value = 'No se encontró al personal';
      }
    } catch (err) {
      studentData.value = null;
      error.value = 'Error al buscar el personal';
    }
  };

  return {
    studentData,
    error,
    searchStudent
  };
}