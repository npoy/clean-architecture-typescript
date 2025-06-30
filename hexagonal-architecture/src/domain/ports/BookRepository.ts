import { Book } from "../models/Book.js";

export interface BookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<Book>;
  update(id: string, book: Partial<Book>): Promise<Book | null>;
  delete(id: string): Promise<boolean>;
  findBy(filter: Partial<Book>): Promise<Book[]>;
}