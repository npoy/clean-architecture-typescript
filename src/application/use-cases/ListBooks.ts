import { Book } from '../../domain/entities/Book.js';
import { BookRepository } from '../../domain/repositories/BookRepository.js';
import { injectable } from '../../config/decorators.js';

@injectable()
export class ListBooks {
  private readonly bookRepository: BookRepository;
  
  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(): Promise<Book[]> {
    // Might have some business logic here
    return this.bookRepository.findAll();
  }
}