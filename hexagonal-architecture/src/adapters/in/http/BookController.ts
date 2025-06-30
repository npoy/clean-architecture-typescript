import { Request, Response } from "express";
import { ListBooks } from "../../../application/use-cases/ListBooks.js";
import { GetBookById } from "../../../application/use-cases/GetBookById.js";
import { CreateBook } from "../../../application/use-cases/CreateBook.js";
import { UpdateBook } from "../../../application/use-cases/UpdateBook.js";
import { DeleteBook } from "../../../application/use-cases/DeleteBook.js";
import { SearchBooks } from "../../../application/use-cases/SearchBooks.js";
import { TOKENS } from "../../../config/tokens.js";
import { inject } from "../../../config/decorators.js";

@inject(TOKENS.ListBooks, TOKENS.GetBookById, TOKENS.CreateBook, TOKENS.UpdateBook, TOKENS.DeleteBook, TOKENS.SearchBooks)
export class BookController {
  private readonly listBooks: ListBooks;
  private readonly getBookById: GetBookById;
  private readonly createBook: CreateBook;
  private readonly updateBook: UpdateBook;
  private readonly deleteBook: DeleteBook;
  private readonly searchBooks: SearchBooks;
  
  constructor(
    listBooks: ListBooks,
    getBookById: GetBookById,
    createBook: CreateBook,
    updateBook: UpdateBook,
    deleteBook: DeleteBook,
    searchBooks: SearchBooks
  ) {
    this.listBooks = listBooks;
    this.getBookById = getBookById;
    this.createBook = createBook;
    this.updateBook = updateBook;
    this.deleteBook = deleteBook;
    this.searchBooks = searchBooks;
  }

  getAll = async(_req: Request, res: Response) => {
    try {
      const books = await this.listBooks.execute();
      res.json(books);
    } catch (error) {
      console.error("Error in BookController.getAll:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  getById = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const book = await this.getBookById.execute(id);
      
      if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
      
      res.json(book);
    } catch (error) {
      console.error("Error in BookController.getById:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  create = async(req: Request, res: Response) => {
    try {
      const { title, author, price } = req.body;
      
      if (!title || !author || !price) {
        res.status(400).json({ error: "Title, author, and price are required" });
        return;
      }
      
      const book = await this.createBook.execute({ title, author, price });
      res.status(201).json(book);
    } catch (error) {
      console.error("Error in BookController.create:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  update = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const book = await this.updateBook.execute(id, updateData);
      
      if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
      
      res.json(book);
    } catch (error) {
      console.error("Error in BookController.update:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  delete = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await this.deleteBook.execute(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Book not found" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error in BookController.delete:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  search = async(req: Request, res: Response) => {
    try {
      const filter = req.query;
      const books = await this.searchBooks.execute(filter);
      res.json(books);
    } catch (error) {
      console.error("Error in BookController.search:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}