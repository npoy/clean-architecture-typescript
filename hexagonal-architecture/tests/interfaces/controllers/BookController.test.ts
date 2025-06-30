import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BookController } from '../../../src/interfaces/controllers/BookController.js';
import { Book } from '../../../src/domain/entities/Book.js';
import { BookRepository } from '../../../src/domain/repositories/BookRepository.js';
import { ListBooks } from '../../../src/application/use-cases/ListBooks.js';
import { GetBookById } from '../../../src/application/use-cases/GetBookById.js';
import { CreateBook } from '../../../src/application/use-cases/CreateBook.js';
import { UpdateBook } from '../../../src/application/use-cases/UpdateBook.js';
import { DeleteBook } from '../../../src/application/use-cases/DeleteBook.js';
import { SearchBooks } from '../../../src/application/use-cases/SearchBooks.js';

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

describe('BookController', () => {
  it('should create controller with all use cases', () => {
    // Arrange
    const mockRepository = new MockBookRepository();
    const listBooks = new ListBooks(mockRepository);
    const getBookById = new GetBookById(mockRepository);
    const createBook = new CreateBook(mockRepository);
    const updateBook = new UpdateBook(mockRepository);
    const deleteBook = new DeleteBook(mockRepository);
    const searchBooks = new SearchBooks(mockRepository);

    // Act
    const controller = new BookController(
      listBooks,
      getBookById,
      createBook,
      updateBook,
      deleteBook,
      searchBooks
    );

    // Assert
    assert(controller instanceof BookController);
  });

  it('should handle getAll method', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Test Book 1', author: 'Author 1', price: 25 },
      { id: '2', title: 'Test Book 2', author: 'Author 2', price: 30 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const listBooks = new ListBooks(mockRepository);
    const getBookById = new GetBookById(mockRepository);
    const createBook = new CreateBook(mockRepository);
    const updateBook = new UpdateBook(mockRepository);
    const deleteBook = new DeleteBook(mockRepository);
    const searchBooks = new SearchBooks(mockRepository);

    const controller = new BookController(
      listBooks,
      getBookById,
      createBook,
      updateBook,
      deleteBook,
      searchBooks
    );

    // Mock Express response
    const mockResponse = {
      json: (data: any) => {
        assert.strictEqual(data.length, 2);
        assert.strictEqual(data[0].title, 'Test Book 1');
        assert.strictEqual(data[1].title, 'Test Book 2');
      },
      status: (code: number) => ({
        json: (data: any) => {
          assert.fail('Should not reach error status');
        }
      })
    };

    // Act
    await controller.getAll({} as any, mockResponse as any);
  });

  it('should handle getById method with existing book', async () => {
    // Arrange
    const testBooks: Book[] = [
      { id: '1', title: 'Test Book 1', author: 'Author 1', price: 25 }
    ];
    const mockRepository = new MockBookRepository(testBooks);
    const listBooks = new ListBooks(mockRepository);
    const getBookById = new GetBookById(mockRepository);
    const createBook = new CreateBook(mockRepository);
    const updateBook = new UpdateBook(mockRepository);
    const deleteBook = new DeleteBook(mockRepository);
    const searchBooks = new SearchBooks(mockRepository);

    const controller = new BookController(
      listBooks,
      getBookById,
      createBook,
      updateBook,
      deleteBook,
      searchBooks
    );

    // Mock Express request and response
    const mockRequest = {
      params: { id: '1' }
    } as any;

    const mockResponse = {
      json: (data: any) => {
        assert.strictEqual(data.id, '1');
        assert.strictEqual(data.title, 'Test Book 1');
      },
      status: (code: number) => ({
        json: (data: any) => {
          assert.fail('Should not reach error status');
        }
      })
    };

    // Act
    await controller.getById(mockRequest, mockResponse as any);
  });

  it('should handle getById method with non-existing book', async () => {
    // Arrange
    const mockRepository = new MockBookRepository([]);
    const listBooks = new ListBooks(mockRepository);
    const getBookById = new GetBookById(mockRepository);
    const createBook = new CreateBook(mockRepository);
    const updateBook = new UpdateBook(mockRepository);
    const deleteBook = new DeleteBook(mockRepository);
    const searchBooks = new SearchBooks(mockRepository);

    const controller = new BookController(
      listBooks,
      getBookById,
      createBook,
      updateBook,
      deleteBook,
      searchBooks
    );

    // Mock Express request and response
    const mockRequest = {
      params: { id: '999' }
    } as any;

    let statusCode = 0;
    const mockResponse = {
      json: (data: any) => {
        assert.fail('Should not reach success json');
      },
      status: (code: number) => {
        statusCode = code;
        return {
          json: (data: any) => {
            assert.strictEqual(statusCode, 404);
            assert(data.error.includes('Book not found'));
          }
        };
      }
    };

    // Act
    await controller.getById(mockRequest, mockResponse as any);
  });
}); 