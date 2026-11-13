import { describe, it, expect, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { BaseInMemoryService, BaseEntity } from './base-in-memory.service';

interface TestItem extends BaseEntity {
  name: string;
}

class ConcreteTestService extends BaseInMemoryService<TestItem> {
  protected readonly entityName = 'Elemento';

  add(item: TestItem): TestItem {
    this.items.push(item);
    return item;
  }
}

describe('BaseInMemoryService (POO Base Unit Tests)', () => {
  let service: ConcreteTestService;

  beforeEach(() => {
    service = new ConcreteTestService();
  });

  it('debe registrar y listar todos los elementos', () => {
    service.add({ id: 'item-1', name: 'Primero' });
    service.add({ id: 'item-2', name: 'Segundo' });
    expect(service.findAll()).toHaveLength(2);
    expect(service.count()).toBe(2);
  });

  it('debe encontrar un elemento por su id', () => {
    service.add({ id: 'item-1', name: 'Primero' });
    const found = service.findById('item-1');
    expect(found.name).toBe('Primero');
  });

  it('debe lanzar NotFoundException si el elemento no existe', () => {
    expect(() => service.findById('inexistente')).toThrow(NotFoundException);
  });

  it('debe eliminar un elemento por su id', () => {
    service.add({ id: 'item-1', name: 'Primero' });
    expect(service.removeById('item-1')).toBe(true);
    expect(service.count()).toBe(0);
  });
});

