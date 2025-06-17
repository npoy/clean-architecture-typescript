import { Request, Response } from "express";
import { ListBooks } from "../../application/use-cases/ListBooks.js";
import { injectable } from "../../config/decorators.js";

@injectable()
export class BookController {
  private readonly listBooks: ListBooks;
  
  constructor(listBooks: ListBooks) {
    this.listBooks = listBooks;
  }

  getAll = async(_req: Request, res: Response) => {
    try {
      const books = await this.listBooks.execute();
      res.json(books);
    } catch (error) {
      console.error("Error in BookController:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}