import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SearchBooks } from '../../../src/application/use-cases/SearchBooks.js';
import { Book } from '../../../src/domain/models/Book.js';
import { BookRepository } from '../../../src/domain/ports/BookRepository.js';

// Mock implementation of BookRepository for testing
class MockBookRepository implements BookRepository {
  private books: Book[] = [];

  constructor(books: Book[] = []) {
    this.books = books;
  }

  async findAll(): Promise<Book[]> {
    return this.books;
  }

  async findById(id: string): Promise<Book | null> {
    return this.books.find(book => book.id === id) || null;
  }

  async save(book: Book): Promise<Book> {
    this.books.push(book);
    return book;
  }

  async update(id: string, book: Partial<Book>): Promise<Book | null> {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.books[index] = { ...this.books[index], ...book };
    return this.books[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.books.splice(index, 1);
    return true;
  }

  async findBy(filter: Partial<Book>): Promise<Book[]> {
    return this.books.filter(book => {
      return Object.entries(filter).every(([key, value]) => {
        if (value === undefined || value === null) return true;
        const bookValue = book[key as keyof Book];
        if (typeof value === 'string' && typeof bookValue === 'string') {
          return bookValue.toLowerCase().includes(value.toLowerCase());
        }
        return bookValue === value;
      });
    });
  }
}

describe('SearchBooks Use Case', () => {
  it('should filter books by title', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin', price: 30 },
      { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 25 },
      { id: '3', title: 'Refactoring', author: 'Martin Fowler', price: 35 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const searchBooks = new SearchBooks(mockRepository);

    // Act
    const result = await searchBooks.execute({ title: 'Clean' });

    // Assert
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].title, 'Clean Code');
  });

  it('should filter books by author', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin', price: 30 },
      { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 25 },
      { id: '3', title: 'Refactoring', author: 'Martin Fowler', price: 35 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const searchBooks = new SearchBooks(mockRepository);

    // Act
    const result = await searchBooks.execute({ author: 'Robert' });

    // Assert
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].author, 'Robert C. Martin');
  });

  it('should filter books by price (string to number conversion)', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin', price: 30 },
      { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 25 },
      { id: '3', title: 'Refactoring', author: 'Martin Fowler', price: 35 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const searchBooks = new SearchBooks(mockRepository);

    // Act
    const result = await searchBooks.execute({ price: '30' });

    // Assert
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].price, 30);
  });

  it('should filter books by multiple criteria', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin', price: 30 },
      { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 25 },
      { id: '3', title: 'Refactoring', author: 'Martin Fowler', price: 35 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const searchBooks = new SearchBooks(mockRepository);

    // Act
    const result = await searchBooks.execute({ 
      title: 'Clean', 
      author: 'Robert',
      price: '30'
    });

    // Assert
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].title, 'Clean Code');
  });

  it('should ignore invalid price values', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin', price: 30 },
      { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 25 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const searchBooks = new SearchBooks(mockRepository);

    // Act
    const result = await searchBooks.execute({ 
      title: 'Clean',
      price: 'invalid-price'
    });

    // Assert - should only filter by title since price is invalid
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].title, 'Clean Code');
  });

  it('should ignore non-string title and author values', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin', price: 30 },
      { id: '2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', price: 25 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const searchBooks = new SearchBooks(mockRepository);

    // Act
    const result = await searchBooks.execute({ 
      title: 123 as any,
      author: null as any
    });

    // Assert - should return all books since filters are invalid
    assert.strictEqual(result.length, 2);
  });

  it('should return empty array when no matches found', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin', price: 30 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const searchBooks = new SearchBooks(mockRepository);

    // Act
    const result = await searchBooks.execute({ title: 'NonExistent' });

    // Assert
    assert.strictEqual(result.length, 0);
  });

  it('should handle empty filter gracefully', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Clean Code', author: 'Robert C. Martin', price: 30 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const searchBooks = new SearchBooks(mockRepository);

    // Act
    const result = await searchBooks.execute({});

    // Assert - should return all books when no filters applied
    assert.strictEqual(result.length, 1);
  });
}); 