import { container } from "./di-container.js";
import { InMemoryBookRepository } from "../adapters/out/db/InMemoryBookRepository.js";
import { SQLiteBookRepository } from "../adapters/out/db/SQLiteBookRepository.js";
import { ListBooks } from "../application/use-cases/book/ListBooks.js";
import { GetBookById } from "../application/use-cases/book/GetBookById.js";
import { CreateBook } from "../application/use-cases/book/CreateBook.js";
import { UpdateBook } from "../application/use-cases/book/UpdateBook.js";
import { DeleteBook } from "../application/use-cases/book/DeleteBook.js";
import { SearchBooks } from "../application/use-cases/book/SearchBooks.js";
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