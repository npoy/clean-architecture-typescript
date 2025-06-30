import "./config/dependencies.js";
import express from "express";
import { container } from "./config/di-container.js";
import { BookController } from "./interfaces/controllers/BookController.js";

const app = express();
app.use(express.json());

const bookController = container.resolve<BookController>("BookController");

// CRUD routes - specific routes first, then parameterized routes
app.get("/books", bookController.getAll);
app.get("/books/search", bookController.search);
app.post("/books", bookController.create);
app.get("/books/:id", bookController.getById);
app.put("/books/:id", bookController.update);
app.delete("/books/:id", bookController.delete);

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

