import { container } from "./di-container.js";
import { InMemoryBookRepository } from "../adapters/out/db/InMemoryBookRepository.js";
import { SQLiteBookRepository } from "../adapters/out/db/SQLiteBookRepository.js";
import { ListBooks } from "../application/use-cases/ListBooks.js";
import { GetBookById } from "../application/use-cases/GetBookById.js";
import { CreateBook } from "../application/use-cases/CreateBook.js";
import { UpdateBook } from "../application/use-cases/UpdateBook.js";
import { DeleteBook } from "../application/use-cases/DeleteBook.js";
import { SearchBooks } from "../application/use-cases/SearchBooks.js";
import { BookController } from "../adapters/in/http/BookController.js";

if (process.env.NODE_ENV === 'production') {
  container.register("BookRepository", InMemoryBookRepository);
} else {
  container.register("BookRepository", SQLiteBookRepository);
}

container.register("ListBooks", ListBooks);
container.register("GetBookById", GetBookById);
container.register("CreateBook", CreateBook);
container.register("UpdateBook", UpdateBook);
container.register("DeleteBook", DeleteBook);
container.register("SearchBooks", SearchBooks);
container.register("BookController", BookController);