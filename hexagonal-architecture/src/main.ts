import "./config/dependencies.js";
import express from "express";
import { container } from "./config/di-container.js";
import { BookController } from "./adapters/in/http/BookController.js";
import { createBookRoutes } from "./adapters/in/routes/bookRoutes.js";

const app = express();
app.use(express.json());

const bookController = container.resolve<BookController>("BookController");

// Register domain routes
app.use("/books", createBookRoutes(bookController));

app.listen(3000, () => {
  console.log("Bookstore API is running on port 3000");
  console.log("Available endpoints:");
  console.log("  GET    /books          - Get all books");
  console.log("  GET    /books/search   - Search books (query params: title, author, price)");
  console.log("  GET    /books/:id      - Get book by ID");
  console.log("  POST   /books          - Create new book");
  console.log("  PUT    /books/:id      - Update book");
  console.log("  DELETE /books/:id      - Delete book");
});

