import { describe, it, expect } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { validatePillarBudgets } from './pillar-budget.validator';

describe('validatePillarBudgets (Unit Tests)', () => {
  it('debe aceptar presupuestos por pilar válidos que no superen el presupuesto anual', () => {
    expect(() => {
      validatePillarBudgets(11210000, {
        investigacion: 0,
        encarnacion: 0,
        evangelizacion: 0,
        entrenamiento: 11210000,
        autocuidado: 0,
      });
    }).not.toThrow();
  });

  it('debe rechazar cuando un pilar individual supera el presupuesto anual', () => {
    expect(() => {
      validatePillarBudgets(11210000, {
        investigacion: 12000000,
        encarnacion: 0,
        evangelizacion: 0,
        entrenamiento: 0,
        autocuidado: 0,
      });
    }).toThrow(BadRequestException);
  });

  it('debe rechazar cuando la suma de pilares supera el presupuesto anual aunque individualmente sean menores', () => {
    expect(() => {
      validatePillarBudgets(10000000, {
        investigacion: 6000000,
        encarnacion: 5000000,
        evangelizacion: 0,
        entrenamiento: 0,
        autocuidado: 0,
      });
    }).toThrow(BadRequestException);
  });

  it('debe rechazar presupuestos negativos por pilar', () => {
    expect(() => {
      validatePillarBudgets(10000000, {
        investigacion: -500000,
      });
    }).toThrow(BadRequestException);
  });

  it('debe manejar de forma segura cuando pillarBudgets no está definido', () => {
    expect(() => {
      validatePillarBudgets(11210000, undefined);
    }).not.toThrow();
  });
});
