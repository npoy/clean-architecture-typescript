import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ListBooks } from '../../../src/application/use-cases/ListBooks.js';
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

describe('ListBooks Use Case', () => {
  it('should return all books from repository', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '550e8400-e29b-41d4-a716-446655440012', title: 'Test Book 1', author: 'Author 1', price: 25 },
      { id: '550e8400-e29b-41d4-a716-446655440013', title: 'Test Book 2', author: 'Author 2', price: 30 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const listBooks = new ListBooks(mockRepository);

    // Act
    const result = await listBooks.execute();

    // Assert
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].title, 'Test Book 1');
    assert.strictEqual(result[1].title, 'Test Book 2');
  });

  it('should return empty array when repository has no books', async () => {
    // Arrange
    const mockRepository = new MockBookRepository([]);
    const listBooks = new ListBooks(mockRepository);

    // Act
    const result = await listBooks.execute();

    // Assert
    assert.strictEqual(result.length, 0);
  });

  it('should handle repository errors gracefully', async () => {
    // Arrange
    const errorRepository: BookRepository = {
      async findAll(): Promise<Book[]> {
        throw new Error('Database connection failed');
      },
      async findById(): Promise<Book | null> {
        throw new Error('Database connection failed');
      },
      async save(): Promise<Book> {
        throw new Error('Database connection failed');
      },
      async update(): Promise<Book | null> {
        throw new Error('Database connection failed');
      },
      async delete(): Promise<boolean> {
        throw new Error('Database connection failed');
      },
      async findBy(): Promise<Book[]> {
        throw new Error('Database connection failed');
      }
    };
    const listBooks = new ListBooks(errorRepository);

    // Act & Assert
    await assert.rejects(
      async () => await listBooks.execute(),
      /Database connection failed/
    );
  });
}); 