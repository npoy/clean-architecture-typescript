import { Router } from "express";
import { BookController } from "../controllers/BookController.js";

export function createBookRoutes(bookController: BookController): Router {
  const router = Router();

  // CRUD routes - specific routes first, then parameterized routes
  router.get("/", bookController.getAll);
  router.get("/search", bookController.search);
  router.post("/", bookController.create);
  router.get("/:id", bookController.getById);
  router.put("/:id", bookController.update);
  router.delete("/:id", bookController.delete);

  return router;
} 