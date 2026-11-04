import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const STAGES_BY_AREA_MAP: Record<string, string[]> = {
  Investigación: ['Contacto primeros oyentes'],
  Encarnación: ['Comunicar el evangelio'],
  Evangelización: ['Respuesta al evangelio', 'Guiamos a reunirse', 'Consolidamos'],
  Entrenamiento: [
    'Liderazgo',
    'Desarrollo Eclesial',
    'Involucrar liderazgo en el proceso',
    'Pluralidad de liderazgo',
  ],
  Autocuidado: [
    'Auto Cuidado del Misionero',
    'ADN Multiplicador',
    'Salida progresiva',
  ],
  General: [
    'ADN Multiplicador',
    'Salida progresiva',
    'Auto Cuidado del Misionero',
    'General',
  ],
};

@ValidatorConstraint({ name: 'isStageConsistentWithArea', async: false })
export class IsStageConsistentWithAreaConstraint implements ValidatorConstraintInterface {
  validate(stage: string, args: ValidationArguments): boolean {
    const object = args.object as { essentialArea?: string };
    const area = object.essentialArea || 'Investigación';
    const allowed = STAGES_BY_AREA_MAP[area] || [];
    return allowed.includes(stage);
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as { essentialArea?: string };
    const area = object.essentialArea || 'desconocida';
    return `La etapa '$value' no es válida para el área esencial '${area}'.`;
  }
}

export function IsStageConsistentWithArea(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStageConsistentWithAreaConstraint,
    });
  };
}
