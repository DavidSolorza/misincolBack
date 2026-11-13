// Etapas canonicas unificadas del proceso ministerial
export enum StageEnum {
  Contacto = 'Contacto',
  Comunicar = 'Comunicar',
  Respuesta = 'Respuesta',
  Reunirse = 'Reunirse',
  Consolidar = 'Consolidar',
  Liderazgo = 'Liderazgo',
  DesarrolloEclesial = 'Desarrollo eclesial',
  Autocuidado = 'Auto-cuidado',
}

// Tipo union para compatibilidad con firmas de funciones y DTOs
export type StageType = `${StageEnum}`;

