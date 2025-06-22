import { Book } from "../../domain/entities/Book.js";
import { BookRepository } from "../../domain/repositories/BookRepository.js";
import Database from 'better-sqlite3';

export class SQLiteBookRepository implements BookRepository {
  private db: Database.Database;

  constructor() {
    // Use in-memory database for development/testing
    this.db = new Database(':memory:');
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    // Create books table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price REAL NOT NULL
      )
    `);

    // Insert sample data if table is empty
    const count = this.db.prepare('SELECT COUNT(*) as count FROM books').get() as { count: number };
    if (count.count === 0) {
      const insert = this.db.prepare('INSERT INTO books (id, title, author, price) VALUES (?, ?, ?, ?)');
      insert.run('1', 'Clean Code', 'Robert C. Martin', 30);
      insert.run('2', 'The Pragmatic Programmer', 'Andrew Hunt', 25);
    }
  }

  async findAll(): Promise<Book[]> {
    const stmt = this.db.prepare('SELECT id, title, author, price FROM books');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      author: row.author,
      price: row.price
    }));
  }

  async findById(id: string): Promise<Book | null> {
    const stmt = this.db.prepare('SELECT id, title, author, price FROM books WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      price: row.price
    };
  }

  async save(book: Book): Promise<Book> {
    const stmt = this.db.prepare('INSERT OR REPLACE INTO books (id, title, author, price) VALUES (?, ?, ?, ?)');
    stmt.run(book.id, book.title, book.author, book.price);
    
    return book;
  }

  // Cleanup method for testing
  close(): void {
    this.db.close();
  }
} 