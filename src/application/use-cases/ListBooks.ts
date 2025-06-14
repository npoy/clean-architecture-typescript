import { Book } from '../../domain/entities/Book';
import { BookRepository } from '../../domain/repositories/BookRepository';

export class ListBooks {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(): Promise<Book[]> {
    // Might have some business logic here
    return this.bookRepository.findAll();
  }
}