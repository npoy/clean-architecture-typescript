import { describe, it } from 'node:test';
import assert from 'node:assert';
import { DeleteBook } from '../../../src/application/use-cases/book/DeleteBook.js';
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

describe('DeleteBook Use Case', () => {
  it('should delete a book when it exists', async () => {
    // Arrange
    const testBook: Book = {
      id: '550e8400-e29b-41d4-a716-446655440021',
      title: 'Test Book',
      author: 'Test Author',
      price: 25
    };
    const mockRepository = new MockBookRepository([testBook]);
    const deleteBook = new DeleteBook(mockRepository);

    // Act
    const result = await deleteBook.execute('550e8400-e29b-41d4-a716-446655440021');

    // Assert
    assert.strictEqual(result, true);
    const remainingBooks = await mockRepository.findAll();
    assert.strictEqual(remainingBooks.length, 0);
  });

  it('should return false when book does not exist', async () => {
    // Arrange
    const mockRepository = new MockBookRepository([]);
    const deleteBook = new DeleteBook(mockRepository);

    // Act
    const result = await deleteBook.execute('non-existent-id');

    // Assert
    assert.strictEqual(result, false);
  });

  it('should return false for empty string ID', async () => {
    // Arrange
    const mockRepository = new MockBookRepository([]);
    const deleteBook = new DeleteBook(mockRepository);

    // Act
    const result = await deleteBook.execute('');

    // Assert
    assert.strictEqual(result, false);
  });

  it('should only delete the specified book when multiple books exist', async () => {
    // Arrange
    const testBooks: Book[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440022',
        title: 'Book 1',
        author: 'Author 1',
        price: 25
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440023',
        title: 'Book 2',
        author: 'Author 2',
        price: 30
      }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const deleteBook = new DeleteBook(mockRepository);

    // Act
    const result = await deleteBook.execute('550e8400-e29b-41d4-a716-446655440022');

    // Assert
    assert.strictEqual(result, true);
    const remainingBooks = await mockRepository.findAll();
    assert.strictEqual(remainingBooks.length, 1);
    assert.strictEqual(remainingBooks[0].id, '550e8400-e29b-41d4-a716-446655440023');
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
    const deleteBook = new DeleteBook(errorRepository);

    // Act & Assert
    await assert.rejects(
      async () => await deleteBook.execute('some-id'),
      /Database connection failed/
    );
  });

  it('should verify book is actually removed from repository', async () => {
    // Arrange
    const testBook: Book = {
      id: '550e8400-e29b-41d4-a716-446655440024',
      title: 'Test Book',
      author: 'Test Author',
      price: 25
    };
    const mockRepository = new MockBookRepository([testBook]);
    const deleteBook = new DeleteBook(mockRepository);

    // Act
    await deleteBook.execute('550e8400-e29b-41d4-a716-446655440024');

    // Assert
    const foundBook = await mockRepository.findById('550e8400-e29b-41d4-a716-446655440024');
    assert.strictEqual(foundBook, null);
  });
}); 