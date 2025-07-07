import { Book } from "../../../domain/models/Book.js";
import { BookRepository } from "../../../domain/ports/BookRepository.js";

export class InMemoryBookRepository implements BookRepository {
  private books: Book[] = [
    { id: "550e8400-e29b-41d4-a716-446655440000", title: "Clean Code", author: "Robert C. Martin", price: 30 },
    { id: "550e8400-e29b-41d4-a716-446655440001", title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 25 },
  ];

  async findAll(): Promise<Book[]> {
    return this.books;
  }

  async findById(id: string): Promise<Book | null> {
    return this.books.find((book) => book.id === id) || null;
  }

  async save(book: Book): Promise<Book> {
    this.books.push(book);
    return book;
  }

  async update(id: string, bookUpdate: Partial<Book>): Promise<Book | null> {
    const index = this.books.findIndex((book) => book.id === id);
    if (index === -1) return null;
    
    this.books[index] = { ...this.books[index], ...bookUpdate };
    return this.books[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.books.findIndex((book) => book.id === id);
    if (index === -1) return false;
    
    this.books.splice(index, 1);
    return true;
  }

  async findBy(filter: Partial<Book>): Promise<Book[]> {
    return this.books.filter((book) => {
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