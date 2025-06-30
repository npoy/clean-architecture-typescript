# Clean Architecture TypeScript

A simple clean architecture example made with TypeScript, demonstrating dependency injection, separation of concerns, and testable business logic.

## 🏗️ Architecture Overview

This project implements Clean Architecture with four distinct layers:

- **Domain Layer**: Core business entities and interfaces
- **Application Layer**: Use cases and business logic
- **Interface Layer**: Controllers and HTTP handling
- **Infrastructure Layer**: Database implementations and external services

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
│   ├── entities/             # Business entities
│   └── repositories/         # Repository interfaces
├── application/              # Application business rules
│   └── use-cases/           # Use case implementations
├── interfaces/               # Interface adapters
│   └── controllers/         # HTTP controllers
├── infrastructure/           # External concerns
│   └── repositories/        # Repository implementations
├── config/                   # Configuration
│   ├── di-container.ts      # Dependency injection
│   ├── decorators.ts        # DI decorators
│   └── dependencies.ts      # Service registration
└── main.ts                  # Application entry point
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

The project includes unit tests demonstrating:
- Dependency injection testing
- Mock repository implementations
- Use case isolation testing

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

- ✅ **Clean Architecture**: Clear separation of concerns
- ✅ **Dependency Injection**: Easy to test and maintain
- ✅ **TypeScript**: Full type safety
- ✅ **ES Modules**: Modern JavaScript modules
- ✅ **Unit Testing**: Comprehensive test coverage
- ✅ **Multiple Database Support**: In-memory and SQLite implementations

## 🔗 API Endpoints

- `GET /books` - Retrieve all books

## 🧪 Postman Collection

You can test the API using the provided Postman collection:

- Path: `postman/bookstore-api.postman_collection.json`
- To use:
  1. Open Postman.
  2. Click "Import" → Choose the file.
  3. Run the requests against your local or deployed environment.

## 📖 Documentation

- [Architecture Overview](./ARCHITECTURE.md) - Detailed architecture documentation
- [Testing Strategy](./ARCHITECTURE.md#testing-strategy) - Testing approach and examples

## 📄 License

This project is licensed under the ISC License.
