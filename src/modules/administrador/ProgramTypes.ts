// ProgramTypes.ts

// Define la interfaz para una fila de datos
export interface DataRow {
  USUCP_ID?: number; // Añadido para reflejar que es un valor numérico
  USU_ID?: number; // Cambiado a number para reflejar que es un valor numérico
  CAR_ID?: number; // Cambiado a number para reflejar que es un valor numérico
  CAR_NOMBRE?: string;
  CAR_CARRERA?: number; // Cambiado a number para reflejar que es un valor numérico
  CAR_ESCUELA?: number; // Cambiado a number para reflejar que es un valor numérico
  CAR_PADREESC?: number; // Cambiado a number para reflejar que es un valor numérico
  CAR_ACTIVA?: string;
  CAR_ACTIVA_ESCUELA?: string;
  USUCP_TITULACION?: number; // Cambiado a number para reflejar que es un valor numérico
  USUCP_EDITAR?: number; // Cambiado a number para reflejar que es un valor numérico
}

// Define la interfaz para las propiedades del componente
export interface Props {
  data: DataRow[];
  dominio?: string;
}
