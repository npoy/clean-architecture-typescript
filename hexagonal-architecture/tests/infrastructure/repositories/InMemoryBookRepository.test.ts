import { describe, it } from 'node:test';
import assert from 'node:assert';
import { InMemoryBookRepository } from '../../../src/adapters/out/db/InMemoryBookRepository.js';
import { Book } from '../../../src/domain/models/Book.js';

describe('InMemoryBookRepository', () => {
  it('should save and retrieve a book', async () => {
    const repo = new InMemoryBookRepository();
    const book: Book = { 
      id: '550e8400-e29b-41d4-a716-446655440002', 
      title: 'Test', 
      author: 'Author', 
      price: 10 
    };
    await repo.save(book);
    const found = await repo.findById('550e8400-e29b-41d4-a716-446655440002');
    assert.deepStrictEqual(found, book);
  });

  it('should update a book', async () => {
    const repo = new InMemoryBookRepository();
    const book: Book = { 
      id: '550e8400-e29b-41d4-a716-446655440003', 
      title: 'Old', 
      author: 'A', 
      price: 5 
    };
    await repo.save(book);
    await repo.update('550e8400-e29b-41d4-a716-446655440003', { title: 'New' });
    const updated = await repo.findById('550e8400-e29b-41d4-a716-446655440003');
    assert.strictEqual(updated?.title, 'New');
  });

  it('should delete a book', async () => {
    const repo = new InMemoryBookRepository();
    const book: Book = { 
      id: '550e8400-e29b-41d4-a716-446655440004', 
      title: 'ToDelete', 
      author: 'B', 
      price: 7 
    };
    await repo.save(book);
    const deleted = await repo.delete('550e8400-e29b-41d4-a716-446655440004');
    assert.strictEqual(deleted, true);
    const found = await repo.findById('550e8400-e29b-41d4-a716-446655440004');
    assert.strictEqual(found, null);
  });

  it('should return all books', async () => {
    const repo = new InMemoryBookRepository();
    const books: Book[] = [
      { id: '550e8400-e29b-41d4-a716-446655440005', title: 'A', author: 'A', price: 1 },
      { id: '550e8400-e29b-41d4-a716-446655440006', title: 'B', author: 'B', price: 2 }
    ];
    for (const book of books) await repo.save(book);
    const all = await repo.findAll();
    assert.strictEqual(all.length, 4); // 2 sample books + 2 added books
  });

  it('should find books by filter', async () => {
    const repo = new InMemoryBookRepository();
    const result = await repo.findBy({ title: 'Clean' });
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].title, 'Clean Code');
  });

  it('should find books by author filter', async () => {
    const repo = new InMemoryBookRepository();
    const result = await repo.findBy({ author: 'Robert' });
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].author, 'Robert C. Martin');
  });

  it('should find books by price filter', async () => {
    const repo = new InMemoryBookRepository();
    const result = await repo.findBy({ price: 30 });
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].price, 30);
  });
}); 