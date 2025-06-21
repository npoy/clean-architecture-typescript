import "./config/dependencies.js";
import express from "express";
import { container } from "./config/di-container.js";
import { BookController } from "./interfaces/controllers/BookController.js";

const app = express();
app.use(express.json());

const bookController = container.resolve<BookController>("BookController");

app.get("/books", bookController.getAll);

app.listen(3000, () => {
  console.log("Bookstore API is running on port 3000");
});

