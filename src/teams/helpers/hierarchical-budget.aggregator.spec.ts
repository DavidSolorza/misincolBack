import { describe, it, expect } from 'vitest';
import { HierarchicalBudgetAggregator, HierarchicalNode } from './hierarchical-budget.aggregator';

describe('HierarchicalBudgetAggregator (Recursive Tree Calculations)', () => {
  const treeMock: HierarchicalNode = {
    id: 'fase-entrenamiento',
    name: 'Fase Entrenamiento',
    budget: 0,
    children: [
      {
        id: 'obj-1',
        name: 'Objetivo Liderazgo',
        budget: 0,
        children: [
          { id: 'act-1', name: 'Taller 1', budget: 1500000, isCompleted: true },
          { id: 'act-2', name: 'Taller 2', budget: 1000000, isCompleted: false },
        ],
      },
      {
        id: 'obj-2',
        name: 'Objetivo Eclesial',
        budget: 0,
        children: [
          { id: 'act-3', name: 'Seminario', budget: 2500000, isCompleted: true },
        ],
      },
    ],
  };

  it('debe calcular recursivamente la sumatoria total del presupuesto del arbol', () => {
    const total = HierarchicalBudgetAggregator.calculateTotalBudget(treeMock);
    expect(total).toBe(5000000);
  });

  it('debe contar recursivamente el total de actividades y las completadas', () => {
    const counts = HierarchicalBudgetAggregator.countLeaves(treeMock);
    expect(counts.total).toBe(3);
    expect(counts.completed).toBe(2);
  });

  it('debe generar el resumen consolidado con el porcentaje de avance correcto', () => {
    const summary = HierarchicalBudgetAggregator.aggregateSummary(treeMock);
    expect(summary.totalBudget).toBe(5000000);
    expect(summary.totalActivities).toBe(3);
    expect(summary.completedActivities).toBe(2);
    expect(summary.progressPercentage).toBe(67);
  });
});

