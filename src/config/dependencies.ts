import { container } from "./di-container.js";
import { InMemoryBookRepository } from "../infrastructure/repositories/InMemoryBookRepository.js";
import { ListBooks } from "../application/use-cases/ListBooks.js";
import { BookController } from "../interfaces/controllers/BookController.js";

container.register("BookRepository", InMemoryBookRepository);
container.register("ListBooks", ListBooks);
container.register("BookController", BookController);