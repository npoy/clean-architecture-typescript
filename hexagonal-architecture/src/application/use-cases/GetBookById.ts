import { Book } from '../../domain/models/Book.js';
import { BookRepository } from '../../domain/ports/BookRepository.js';
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