import { NotFoundException } from '@nestjs/common';

export interface BaseEntity {
  id: string;
}

// Clase base generica con patron de persistencia en memoria (POO & DRY)
export abstract class BaseInMemoryService<T extends BaseEntity> {
  protected items: T[] = [];
  protected abstract readonly entityName: string;

  findAll(): T[] {
    return [...this.items];
  }

  findById(id: string): T {
    const found = this.items.find((item) => item.id === id);
    if (!found) {
      throw new NotFoundException(`${this.entityName} con ID ${id} no encontrado(a)`);
    }
    return found;
  }

  exists(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

  removeById(id: string): boolean {
    const prevLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    if (this.items.length === prevLength) {
      throw new NotFoundException(`${this.entityName} con ID ${id} no encontrado(a)`);
    }
    return true;
  }

  count(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

