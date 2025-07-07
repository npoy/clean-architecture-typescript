import { Book } from "../../../domain/entities/Book.js";
import { BookRepository } from "../../../domain/repositories/BookRepository.js";
import { TOKENS } from "../../../config/tokens.js";
import { inject } from "../../../config/decorators.js";

@inject(TOKENS.BookRepository)
export class UpdateBook {
  private readonly bookRepository: BookRepository;
  
  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id: string, bookData: Partial<Book>): Promise<Book | null> {
    return this.bookRepository.update(id, bookData);
  }
} 