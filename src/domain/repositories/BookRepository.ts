import { Book } from "../entities/Book";

export interface BookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<Book>;
}