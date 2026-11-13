import { describe, it, expect } from 'vitest';
import {
  IsStageConsistentWithAreaConstraint,
  STAGES_BY_AREA_MAP,
} from './is-stage-consistent.validator';

describe('IsStageConsistentWithArea (Unit Tests)', () => {
  const validator = new IsStageConsistentWithAreaConstraint();

  it('debe validar etapas canonicas para Investigacion', () => {
    const mockArgs = { object: { essentialArea: 'Investigación' } } as any;
    expect(validator.validate('Contacto', mockArgs)).toBe(true);
    expect(validator.validate('Comunicar', mockArgs)).toBe(false);
  });

  it('debe validar etapas canonicas para Encarnacion', () => {
    const mockArgs = { object: { essentialArea: 'Encarnación' } } as any;
    expect(validator.validate('Contacto', mockArgs)).toBe(true);
    expect(validator.validate('Comunicar', mockArgs)).toBe(true);
    expect(validator.validate('Respuesta', mockArgs)).toBe(true);
    expect(validator.validate('Consolidar', mockArgs)).toBe(false);
  });

  it('debe validar etapas canonicas para Evangelizacion', () => {
    const mockArgs = { object: { essentialArea: 'Evangelización' } } as any;
    expect(validator.validate('Respuesta', mockArgs)).toBe(true);
    expect(validator.validate('Reunirse', mockArgs)).toBe(true);
    expect(validator.validate('Consolidar', mockArgs)).toBe(true);
    expect(validator.validate('Liderazgo', mockArgs)).toBe(false);
  });

  it('debe validar etapas canonicas para Entrenamiento', () => {
    const mockArgs = { object: { essentialArea: 'Entrenamiento' } } as any;
    expect(validator.validate('Consolidar', mockArgs)).toBe(true);
    expect(validator.validate('Liderazgo', mockArgs)).toBe(true);
    expect(validator.validate('Desarrollo eclesial', mockArgs)).toBe(true);
    expect(validator.validate('Salida progresiva', mockArgs)).toBe(false);
  });

  it('debe validar etapas canonicas para Autocuidado', () => {
    const mockArgs = { object: { essentialArea: 'Autocuidado' } } as any;
    expect(validator.validate('Auto-cuidado', mockArgs)).toBe(true);
    expect(validator.validate('Salida progresiva', mockArgs)).toBe(false);
    expect(validator.validate('Comunicar', mockArgs)).toBe(false);
  });

  it('debe incluir los 5 pilares ministeriales oficiales en el mapa', () => {
    const pillars = Object.keys(STAGES_BY_AREA_MAP);
    expect(pillars).toContain('Investigación');
    expect(pillars).toContain('Encarnación');
    expect(pillars).toContain('Evangelización');
    expect(pillars).toContain('Entrenamiento');
    expect(pillars).toContain('Autocuidado');
  });
});
