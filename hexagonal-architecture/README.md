# Hexagonal Architecture TypeScript

A simple hexagonal architecture example made with TypeScript, demonstrating ports and adapters pattern, dependency injection, and testable business logic.

## 🏗️ Architecture Overview

This project implements Hexagonal Architecture (Ports and Adapters) with three main components:

- **Domain Core**: Business entities and port definitions
- **Application Core**: Use cases and business logic
- **Adapters**: Inbound (HTTP controllers) and outbound (database repositories) adapters

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the development server
npm run dev
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📁 Project Structure

```
src/
├── domain/                    # Core business logic
│   ├── models/               # Business entities
│   └── ports/                # Port definitions (interfaces)
├── application/              # Application business rules
│   └── use-cases/           # Use case implementations
├── adapters/                 # Interface adapters
│   ├── in/                  # Inbound adapters (HTTP controllers)
│   └── out/                 # Outbound adapters (database repositories)
├── config/                   # Configuration
│   ├── di-container.ts      # Dependency injection
│   ├── decorators.ts        # DI decorators
│   ├── dependencies.ts      # Service registration
│   └── tokens.ts            # DI tokens
└── main.ts                  # Application entry point
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

The project includes comprehensive unit tests demonstrating:
- Port and adapter testing
- Mock repository implementations
- Use case isolation testing
- Dependency injection testing

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm run start:prod` - Start production server with production environment
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode

## 🌍 Environment Configuration

The application supports different environments:

- **Development**: Uses in-memory repository
- **Production**: Uses SQLite database
- **Test**: Uses in-memory repository for fast testing

Set `NODE_ENV` environment variable to control the behavior.

## 📚 Key Features

- ✅ **Hexagonal Architecture**: Ports and adapters pattern
- ✅ **Dependency Injection**: Easy to test and maintain
- ✅ **TypeScript**: Full type safety
- ✅ **ES Modules**: Modern JavaScript modules
- ✅ **Unit Testing**: Comprehensive test coverage
- ✅ **Multiple Database Support**: In-memory and SQLite implementations

## 🔗 API Endpoints

- `GET /books` - Retrieve all books
- `GET /books/search` - Search books with filters
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book
- `PUT /books/:id` - Update book
- `DELETE /books/:id` - Delete book

## 🧪 Postman Collection

You can test the API using the provided Postman collection:

- Path: `postman/bookstore-api.postman_collection.json`
- To use:
  1. Open Postman.
  2. Click "Import" → Choose the file.
  3. Run the requests against your local or deployed environment.

## 📖 Documentation

- [Architecture Overview](./ARCHITECTURE.md) - Detailed hexagonal architecture documentation
- [Testing Strategy](./ARCHITECTURE.md#testing-strategy) - Testing approach and examples

## 🔄 Hexagonal Architecture Benefits

### **Ports and Adapters Pattern**
- **Inbound Adapters**: Handle external input (HTTP, CLI, etc.)
- **Outbound Adapters**: Handle external output (databases, APIs, etc.)
- **Ports**: Define contracts between core and adapters

### **Technology Agnostic**
- Core business logic independent of external frameworks
- Easy to swap adapters for different technologies
- Testable in isolation

### **Scalability**
- Easy to add new adapters for different interfaces
- Clear separation of concerns
- Maintainable codebase

## 📄 License

This project is licensed under the ISC License.
