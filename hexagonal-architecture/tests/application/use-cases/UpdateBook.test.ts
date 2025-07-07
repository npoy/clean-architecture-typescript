import { describe, it } from 'node:test';
import assert from 'node:assert';
import { UpdateBook } from '../../../src/application/use-cases/book/UpdateBook.js';
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

describe('UpdateBook Use Case', () => {
  it('should update a book when it exists', async () => {
    // Arrange
    const originalBook: Book = {
      id: '550e8400-e29b-41d4-a716-446655440017',
      title: 'Original Title',
      author: 'Original Author',
      price: 25
    };
    const mockRepository = new MockBookRepository([originalBook]);
    const updateBook = new UpdateBook(mockRepository);
    const updateData = {
      title: 'Updated Title',
      price: 30
    };

    // Act
    const result = await updateBook.execute('550e8400-e29b-41d4-a716-446655440017', updateData);

    // Assert
    assert.strictEqual(result?.title, 'Updated Title');
    assert.strictEqual(result?.author, 'Original Author'); // Should remain unchanged
    assert.strictEqual(result?.price, 30);
    assert.strictEqual(result?.id, '550e8400-e29b-41d4-a716-446655440017');
  });

  it('should return null when book does not exist', async () => {
    // Arrange
    const mockRepository = new MockBookRepository([]);
    const updateBook = new UpdateBook(mockRepository);
    const updateData = {
      title: 'Updated Title'
    };

    // Act
    const result = await updateBook.execute('non-existent-id', updateData);

    // Assert
    assert.strictEqual(result, null);
  });

  it('should update only provided fields', async () => {
    // Arrange
    const originalBook: Book = {
      id: '550e8400-e29b-41d4-a716-446655440018',
      title: 'Original Title',
      author: 'Original Author',
      price: 25
    };
    const mockRepository = new MockBookRepository([originalBook]);
    const updateBook = new UpdateBook(mockRepository);
    const updateData = {
      author: 'Updated Author'
    };

    // Act
    const result = await updateBook.execute('550e8400-e29b-41d4-a716-446655440018', updateData);

    // Assert
    assert.strictEqual(result?.title, 'Original Title'); // Should remain unchanged
    assert.strictEqual(result?.author, 'Updated Author');
    assert.strictEqual(result?.price, 25); // Should remain unchanged
  });

  it('should handle empty update data', async () => {
    // Arrange
    const originalBook: Book = {
      id: '550e8400-e29b-41d4-a716-446655440019',
      title: 'Original Title',
      author: 'Original Author',
      price: 25
    };
    const mockRepository = new MockBookRepository([originalBook]);
    const updateBook = new UpdateBook(mockRepository);
    const updateData = {};

    // Act
    const result = await updateBook.execute('550e8400-e29b-41d4-a716-446655440019', updateData);

    // Assert
    assert.deepStrictEqual(result, originalBook); // Should remain unchanged
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
    const updateBook = new UpdateBook(errorRepository);
    const updateData = {
      title: 'Updated Title'
    };

    // Act & Assert
    await assert.rejects(
      async () => await updateBook.execute('some-id', updateData),
      /Database connection failed/
    );
  });

  it('should update multiple fields at once', async () => {
    // Arrange
    const originalBook: Book = {
      id: '550e8400-e29b-41d4-a716-446655440020',
      title: 'Original Title',
      author: 'Original Author',
      price: 25
    };
    const mockRepository = new MockBookRepository([originalBook]);
    const updateBook = new UpdateBook(mockRepository);
    const updateData = {
      title: 'New Title',
      author: 'New Author',
      price: 35
    };

    // Act
    const result = await updateBook.execute('550e8400-e29b-41d4-a716-446655440020', updateData);

    // Assert
    assert.strictEqual(result?.title, 'New Title');
    assert.strictEqual(result?.author, 'New Author');
    assert.strictEqual(result?.price, 35);
    assert.strictEqual(result?.id, '550e8400-e29b-41d4-a716-446655440020');
  });
}); 