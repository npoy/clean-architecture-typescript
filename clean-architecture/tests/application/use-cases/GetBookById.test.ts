import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GetBookById } from '../../../src/application/use-cases/book/GetBookById.js';
import { Book } from '../../../src/domain/entities/Book.js';
import { BookRepository } from '../../../src/domain/repositories/BookRepository.js';

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

describe('GetBookById Use Case', () => {
  it('should return a book when it exists', async () => {
    // Arrange
    const testBook: Book = {
      id: '550e8400-e29b-41d4-a716-446655440014',
      title: 'Test Book',
      author: 'Test Author',
      price: 25
    };
    const mockRepository = new MockBookRepository([testBook]);
    const getBookById = new GetBookById(mockRepository);

    // Act
    const result = await getBookById.execute('550e8400-e29b-41d4-a716-446655440014');

    // Assert
    assert.deepStrictEqual(result, testBook);
  });

  it('should return null when book does not exist', async () => {
    // Arrange
    const mockRepository = new MockBookRepository([]);
    const getBookById = new GetBookById(mockRepository);

    // Act
    const result = await getBookById.execute('non-existent-id');

    // Assert
    assert.strictEqual(result, null);
  });

  it('should return null for empty string ID', async () => {
    // Arrange
    const mockRepository = new MockBookRepository([]);
    const getBookById = new GetBookById(mockRepository);

    // Act
    const result = await getBookById.execute('');

    // Assert
    assert.strictEqual(result, null);
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
    const getBookById = new GetBookById(errorRepository);

    // Act & Assert
    await assert.rejects(
      async () => await getBookById.execute('some-id'),
      /Database connection failed/
    );
  });

  it('should return correct book when multiple books exist', async () => {
    // Arrange
    const testBooks: Book[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440015',
        title: 'Book 1',
        author: 'Author 1',
        price: 25
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440016',
        title: 'Book 2',
        author: 'Author 2',
        price: 30
      }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const getBookById = new GetBookById(mockRepository);

    // Act
    const result = await getBookById.execute('550e8400-e29b-41d4-a716-446655440016');

    // Assert
    assert.deepStrictEqual(result, testBooks[1]);
  });
}); 