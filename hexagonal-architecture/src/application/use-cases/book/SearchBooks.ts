import { Book } from "../../../domain/models/Book.js";
import { BookRepository } from "../../../domain/ports/BookRepository.js";
import { TOKENS } from "../../../config/tokens.js";
import { inject } from "../../../config/decorators.js";

@inject(TOKENS.BookRepository)
export class SearchBooks {
  private readonly bookRepository: BookRepository;
  
  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(filter: any): Promise<Book[]> {
    const validatedFilter: Partial<Book> = {};
    
    // Validate and convert filter values
    if (filter.title && typeof filter.title === 'string') {
      validatedFilter.title = filter.title;
    }
    
    if (filter.author && typeof filter.author === 'string') {
      validatedFilter.author = filter.author;
    }
    
    if (filter.price !== undefined && filter.price !== null) {
      const price = parseFloat(filter.price);
      if (!isNaN(price)) {
        validatedFilter.price = price;
      }
    }
    
    return this.bookRepository.findBy(validatedFilter);
  }
} 