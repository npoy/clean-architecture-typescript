import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CreateBook } from '../../../src/application/use-cases/CreateBook.js';
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

describe('CreateBook Use Case', () => {
  it('should create a book with generated UUID', async () => {
    // Arrange
    const mockRepository = new MockBookRepository();
    const createBook = new CreateBook(mockRepository);
    const bookData = {
      title: 'Test Book',
      author: 'Test Author',
      price: 25
    };

    // Act
    const result = await createBook.execute(bookData);

    // Assert
    assert.strictEqual(result.title, 'Test Book');
    assert.strictEqual(result.author, 'Test Author');
    assert.strictEqual(result.price, 25);
    assert.strictEqual(typeof result.id, 'string');
    assert.strictEqual(result.id.length, 36); // UUID length
    assert.strictEqual(result.id.split('-').length, 5); // UUID format
  });

  it('should save the book to repository', async () => {
    // Arrange
    const mockRepository = new MockBookRepository();
    const createBook = new CreateBook(mockRepository);
    const bookData = {
      title: 'Another Book',
      author: 'Another Author',
      price: 30
    };

    // Act
    const createdBook = await createBook.execute(bookData);
    const savedBook = await mockRepository.findById(createdBook.id);

    // Assert
    assert.deepStrictEqual(savedBook, createdBook);
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
    const createBook = new CreateBook(errorRepository);
    const bookData = {
      title: 'Test Book',
      author: 'Test Author',
      price: 25
    };

    // Act & Assert
    await assert.rejects(
      async () => await createBook.execute(bookData),
      /Database connection failed/
    );
  });

  it('should generate unique UUIDs for different books', async () => {
    // Arrange
    const mockRepository = new MockBookRepository();
    const createBook = new CreateBook(mockRepository);
    const bookData1 = {
      title: 'Book 1',
      author: 'Author 1',
      price: 25
    };
    const bookData2 = {
      title: 'Book 2',
      author: 'Author 2',
      price: 30
    };

    // Act
    const book1 = await createBook.execute(bookData1);
    const book2 = await createBook.execute(bookData2);

    // Assert
    assert.notStrictEqual(book1.id, book2.id);
    assert.strictEqual(book1.title, 'Book 1');
    assert.strictEqual(book2.title, 'Book 2');
  });
}); 