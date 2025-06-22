import { container } from "./di-container.js";
import { InMemoryBookRepository } from "../infrastructure/repositories/InMemoryBookRepository.js";
import { SQLiteBookRepository } from "../infrastructure/repositories/SQLiteBookRepository.js";
import { ListBooks } from "../application/use-cases/ListBooks.js";
import { BookController } from "../interfaces/controllers/BookController.js";

if (process.env.NODE_ENV === 'production') {
  container.register("BookRepository", SQLiteBookRepository);
} else {
  container.register("BookRepository", InMemoryBookRepository);
}

container.register("ListBooks", ListBooks);
container.register("BookController", BookController);