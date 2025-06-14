import express from "express";
import { InMemoryBookRepository } from "./infrastructure/repositories/InMemoryBookRepository.js";
import { ListBooks } from "./application/use-cases/ListBooks.js";
import { BookController } from "./interfaces/controllers/BookController.js";

const app = express();
app.use(express.json());

const bookRepository = new InMemoryBookRepository();
const listBooks = new ListBooks(bookRepository);
const bookController = new BookController(listBooks);

app.get("/books", bookController.getAll);

app.listen(3000, () => {
  console.log("Bookstore API is running on port 3000");
});

