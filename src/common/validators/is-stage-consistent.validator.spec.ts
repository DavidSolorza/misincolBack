import { describe, it, expect } from 'vitest';
import {
  IsStageConsistentWithAreaConstraint,
  STAGES_BY_AREA_MAP,
} from './is-stage-consistent.validator';

describe('IsStageConsistentWithArea (Unit Tests)', () => {
  const validator = new IsStageConsistentWithAreaConstraint();

  it('debe validar etapas válidas para Investigación', () => {
    const mockArgs = { object: { essentialArea: 'Investigación' } } as any;
    expect(validator.validate('Contacto primeros oyentes', mockArgs)).toBe(true);
    expect(validator.validate('Contacto', mockArgs)).toBe(true);
    expect(validator.validate('Desarrollo Eclesial', mockArgs)).toBe(false);
  });

  it('debe validar etapas válidas para Entrenamiento', () => {
    const mockArgs = { object: { essentialArea: 'Entrenamiento' } } as any;
    expect(validator.validate('Liderazgo', mockArgs)).toBe(true);
    expect(validator.validate('Desarrollo Eclesial', mockArgs)).toBe(true);
    expect(validator.validate('Contacto primeros oyentes', mockArgs)).toBe(false);
  });

  it('debe validar etapas válidas para Autocuidado y Salida Progresiva', () => {
    const mockArgs = { object: { essentialArea: 'Autocuidado' } } as any;
    expect(validator.validate('Salida progresiva', mockArgs)).toBe(true);
    expect(validator.validate('Auto Cuidado del Misionero', mockArgs)).toBe(true);
    expect(validator.validate('Comunicar el evangelio', mockArgs)).toBe(false);
  });

  it('debe incluir todos los 5 pilares en el mapa oficial', () => {
    const pillars = Object.keys(STAGES_BY_AREA_MAP);
    expect(pillars).toContain('Investigación');
    expect(pillars).toContain('Encarnación');
    expect(pillars).toContain('Evangelización');
    expect(pillars).toContain('Entrenamiento');
    expect(pillars).toContain('Autocuidado');
  });
});
