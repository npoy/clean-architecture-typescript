import { Request, Response } from "express";
import { ListBooks } from '../../application/use-cases/ListBooks';

export class BookController {
  constructor(private readonly listBooks: ListBooks) {}

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