export interface HierarchicalNode {
  id: string;
  name: string;
  budget?: number;
  isCompleted?: boolean;
  children?: HierarchicalNode[];
}

export interface NodeMetricsSummary {
  totalBudget: number;
  totalActivities: number;
  completedActivities: number;
  progressPercentage: number;
}

// Agregador jerarquico recursivo para arboles de Fases, Objetivos y Actividades (POO & Recursividad)
export class HierarchicalBudgetAggregator {
  // Suma recursiva del presupuesto de un nodo y todos sus descendientes
  static calculateTotalBudget(node: HierarchicalNode): number {
    const ownBudget = Number(node.budget) || 0;
    if (!node.children || node.children.length === 0) {
      return ownBudget;
    }
    return ownBudget + node.children.reduce((acc, child) => acc + this.calculateTotalBudget(child), 0);
  }

  // Conteo recursivo de actividades y completitud
  static countLeaves(node: HierarchicalNode): { total: number; completed: number } {
    if (!node.children || node.children.length === 0) {
      return {
        total: 1,
        completed: node.isCompleted ? 1 : 0,
      };
    }
    return node.children.reduce(
      (acc, child) => {
        const childCounts = this.countLeaves(child);
        return {
          total: acc.total + childCounts.total,
          completed: acc.completed + childCounts.completed,
        };
      },
      { total: 0, completed: 0 },
    );
  }

  // Consolida metricas de presupuesto y avance mediante recorrido de arbol
  static aggregateSummary(node: HierarchicalNode): NodeMetricsSummary {
    const totalBudget = this.calculateTotalBudget(node);
    const { total, completed } = this.countLeaves(node);
    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      totalBudget,
      totalActivities: total,
      completedActivities: completed,
      progressPercentage,
    };
  }
}

