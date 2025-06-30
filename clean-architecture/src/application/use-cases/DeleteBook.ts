import { BookRepository } from '../../domain/repositories/BookRepository.js';
import { TOKENS } from "../../config/tokens.js";
import { inject } from "../../config/decorators.js";

@inject(TOKENS.BookRepository)
export class DeleteBook {
  private readonly bookRepository: BookRepository;
  
  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id: string): Promise<boolean> {
    return this.bookRepository.delete(id);
  }
} 