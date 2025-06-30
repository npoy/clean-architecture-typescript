import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DIContainer } from '../../src/config/di-container.js';
import { BookRepository } from '../../src/domain/ports/BookRepository.js';
import { InMemoryBookRepository } from '../../src/adapters/out/db/InMemoryBookRepository.js';

describe('DIContainer', () => {
  it('should register and resolve a service', () => {
    // Arrange
    const container = new DIContainer();

    // Act
    container.register('BookRepository', InMemoryBookRepository);
    const resolved = container.resolve<BookRepository>('BookRepository');

    // Assert
    assert(resolved instanceof InMemoryBookRepository);
  });

  it('should throw error when resolving unregistered service', () => {
    // Arrange
    const container = new DIContainer();

    // Act & Assert
    assert.throws(
      () => container.resolve('UnregisteredService'),
      /No registration for token: UnregisteredService/
    );
  });

  it('should handle multiple registrations with different tokens', () => {
    // Arrange
    const container = new DIContainer();

    // Act
    container.register('Repo1', InMemoryBookRepository);
    container.register('Repo2', InMemoryBookRepository);

    const resolved1 = container.resolve<BookRepository>('Repo1');
    const resolved2 = container.resolve<BookRepository>('Repo2');

    // Assert
    assert(resolved1 instanceof InMemoryBookRepository);
    assert(resolved2 instanceof InMemoryBookRepository);
    // Different tokens should create different singleton instances
    assert.notStrictEqual(resolved1, resolved2);
  });

  it('should allow re-registration of services', () => {
    // Arrange
    const container = new DIContainer();

    // Act
    container.register('BookRepository', InMemoryBookRepository);
    container.register('BookRepository', InMemoryBookRepository); // Re-register

    const resolved = container.resolve<BookRepository>('BookRepository');

    // Assert
    assert(resolved instanceof InMemoryBookRepository);
  });

  it('should return singleton instances for same token', () => {
    // Arrange
    const container = new DIContainer();
    container.register('BookRepository', InMemoryBookRepository);

    // Act
    const instance1 = container.resolve<BookRepository>('BookRepository');
    const instance2 = container.resolve<BookRepository>('BookRepository');

    // Assert
    assert.strictEqual(instance1, instance2);
  });
}); 