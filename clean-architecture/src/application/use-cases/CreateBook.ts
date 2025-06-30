import { Book } from '../../domain/entities/Book.js';
import { BookRepository } from '../../domain/repositories/BookRepository.js';
import { TOKENS } from "../../config/tokens.js";
import { inject } from "../../config/decorators.js";
import { v4 as uuidv4 } from 'uuid';

@inject(TOKENS.BookRepository)
export class CreateBook {
  private readonly bookRepository: BookRepository;
  
  constructor(bookRepository: BookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(bookData: Omit<Book, 'id'>): Promise<Book> {
    const book: Book = {
      id: uuidv4(),
      ...bookData,
    };
    
    return this.bookRepository.save(book);
  }
} 