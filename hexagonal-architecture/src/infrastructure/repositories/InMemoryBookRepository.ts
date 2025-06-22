import { Book } from "../../domain/entities/Book.js";
import { BookRepository } from "../../domain/repositories/BookRepository.js";

export class InMemoryBookRepository implements BookRepository {
  private books: Book[] = [
    { id: "1", title: "Clean Code", author: "Robert C. Martin", price: 30 },
    { id: "2", title: "The Pragmatic Programmer", author: "Andrew Hunt", price: 25 },
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
}