import { Book } from "../../../domain/models/Book.js";
import { BookRepository } from "../../../domain/ports/BookRepository.js";
import { TOKENS } from "../../../config/tokens.js";
import { inject } from "../../../config/decorators.js";

@inject(TOKENS.BookRepository)
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