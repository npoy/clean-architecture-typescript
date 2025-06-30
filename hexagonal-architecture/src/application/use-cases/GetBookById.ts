import { Book } from '../../domain/entities/Book.js';
import { BookRepository } from '../../domain/repositories/BookRepository.js';
import { TOKENS } from "../../config/tokens.js";
import { inject } from "../../config/decorators.js";

@inject(TOKENS.BookRepository)
export class GetBookById {
  private readonly bookRepository: BookRepository;
  
  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id: string): Promise<Book | null> {
    return this.bookRepository.findById(id);
  }
} 