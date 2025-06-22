import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ListBooks } from './ListBooks.js';
import { Book } from '../../domain/entities/Book.js';
import { BookRepository } from '../../domain/repositories/BookRepository.js';

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
}

describe('ListBooks Use Case', () => {
  it('should return all books from repository', async () => {
    // Arrange - Create test data and mock repository
    const testBooks: Book[] = [
      { id: '1', title: 'Test Book 1', author: 'Author 1', price: 25 },
      { id: '2', title: 'Test Book 2', author: 'Author 2', price: 30 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const listBooks = new ListBooks(mockRepository);

    // Act - Execute the use case
    const result = await listBooks.execute();

    // Assert - Verify the result
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].title, 'Test Book 1');
    assert.strictEqual(result[1].title, 'Test Book 2');
  });

  it('should return empty array when repository has no books', async () => {
    // Arrange - Create empty mock repository
    const mockRepository = new MockBookRepository([]);
    const listBooks = new ListBooks(mockRepository);

    // Act
    const result = await listBooks.execute();

    // Assert
    assert.strictEqual(result.length, 0);
  });

  it('should handle repository errors gracefully', async () => {
    // Arrange - Create a repository that throws an error
    const errorRepository: BookRepository = {
      async findAll(): Promise<Book[]> {
        throw new Error('Database connection failed');
      },
      async findById(): Promise<Book | null> {
        throw new Error('Database connection failed');
      },
      async save(): Promise<Book> {
        throw new Error('Database connection failed');
      }
    };
    const listBooks = new ListBooks(errorRepository);

    // Act & Assert - Verify error is propagated
    await assert.rejects(
      async () => await listBooks.execute(),
      /Database connection failed/
    );
  });
}); 