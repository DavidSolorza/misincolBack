import { BadRequestException } from '@nestjs/common';

export function validatePillarBudgets(
  totalBudget: number,
  pillarBudgets?: Record<string, number>
): void {
  if (!pillarBudgets || typeof pillarBudgets !== 'object') {
    return;
  }

  const safeTotal = Number(totalBudget) || 0;
  let sumPillars = 0;

  for (const [pillar, amount] of Object.entries(pillarBudgets)) {
    const numericAmount = Number(amount) || 0;
    if (numericAmount < 0) {
      throw new BadRequestException(
        `El presupuesto del pilar '${pillar}' no puede ser negativo ($${numericAmount.toLocaleString('es-CO')} COP).`
      );
    }

    if (numericAmount > safeTotal) {
      throw new BadRequestException(
        `El presupuesto del pilar '${pillar}' ($${numericAmount.toLocaleString('es-CO')} COP) no puede superar el presupuesto anual del equipo ($${safeTotal.toLocaleString('es-CO')} COP).`
      );
    }

    sumPillars += numericAmount;
  }

  if (sumPillars > safeTotal) {
    throw new BadRequestException(
      `La suma total de los presupuestos por pilar ($${sumPillars.toLocaleString('es-CO')} COP) supera el presupuesto anual asignado ($${safeTotal.toLocaleString('es-CO')} COP).`
    );
  }
}
