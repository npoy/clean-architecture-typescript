# Hexagonal Architecture Implementation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    HEXAGONAL ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    INBOUND ADAPTERS                        │ │
│  │  (Primary/Driving Adapters)                                │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │              HTTP Controller                            │ │ │
│  │  │  - Handles HTTP requests                                │ │ │
│  │  │  - Delegates to use cases                               │ │ │
│  │  │  - Returns HTTP responses                               │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                  APPLICATION CORE                          │ │
│  │  (Use Cases, Business Logic)                               │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │              ListBooks                                  │ │ │
│  │  │  - Business logic                                       │ │ │
│  │  │  - Orchestrates domain objects                          │ │ │
│  │  │  - Uses repository ports                                │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    DOMAIN CORE                             │ │
│  │  (Entities, Ports)                                         │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │              Book Model                                 │ │ │
│  │  │  - Core business entity                                 │ │ │
│  │  │  - Contains business rules                              │ │ │
│  │  │  - Independent of frameworks                            │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │           BookRepository Port                           │ │ │
│  │  │  - Defines contract for data access                     │ │ │
│  │  │  - Domain-driven design                                 │ │ │
│  │  │  - Framework independent                                │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   OUTBOUND ADAPTERS                        │ │
│  │  (Secondary/Driven Adapters)                               │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │         InMemoryBookRepository                          │ │ │
│  │  │  - Implements BookRepository port                       │ │ │
│  │  │  - In-memory data storage                               │ │ │
│  │  │  - Used for development/testing                         │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │         SQLiteBookRepository                            │ │ │
│  │  │  - Implements BookRepository port                       │ │ │
│  │  │  - SQLite database storage                              │ │ │
│  │  │  - Used for production                                  │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Hexagonal Architecture Principles

### 1. **Ports and Adapters Pattern**
- **Ports**: Define contracts/interfaces for communication
- **Inbound Adapters**: Handle incoming requests (HTTP controllers)
- **Outbound Adapters**: Handle outgoing requests (database repositories)

### 2. **Dependency Inversion**
- Domain core defines ports (interfaces)
- Adapters implement ports
- Application core depends on ports, not adapters

### 3. **Hexagonal Structure**
```
                    ┌─────────────────┐
                    │   Inbound       │
                    │   Adapters      │
                    │  (HTTP, CLI)    │
                    └─────────┬───────┘
                              │
                    ┌─────────▼───────┐
                    │   Application   │
                    │     Core        │
                    │  (Use Cases)    │
                    └─────────┬───────┘
                              │
                    ┌─────────▼───────┐
                    │   Domain Core   │
                    │ (Entities,      │
                    │  Ports)         │
                    └─────────┬───────┘
                              │
                    ┌─────────▼───────┐
                    │   Outbound      │
                    │   Adapters      │
                    │ (Database, API) │
                    └─────────────────┘
```

## Dependency Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Express   │───▶│   HTTP      │───▶│  Use Case   │
│   (HTTP)    │    │  Adapter    │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │ Repository  │
                                       │    Port     │
                                       └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │Repository   │
                                       │  Adapter    │
                                       └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │   Domain    │
                                       │   Model     │
                                       └─────────────┘
```

## Key Principles Implemented

### 1. **Ports and Adapters**
```typescript
// Domain defines the port (interface)
export interface BookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<Book>;
}

// Outbound adapter implements the port
export class InMemoryBookRepository implements BookRepository {
  // Implementation details
}
```

### 2. **Dependency Injection**
```typescript
// Use case depends on port, not adapter
@inject("BookRepository")
export class ListBooks {
  constructor(private bookRepository: BookRepository) {}
}
```

### 3. **Hexagonal Boundaries**
- **Inbound**: HTTP controllers adapt external requests to application core
- **Outbound**: Database repositories adapt application core to external systems
- **Core**: Business logic independent of external concerns

### 4. **Single Responsibility**
- **Inbound Adapters**: Handle external input (HTTP, CLI, etc.)
- **Application Core**: Business logic and use cases
- **Domain Core**: Business entities and port definitions
- **Outbound Adapters**: Handle external output (databases, APIs, etc.)

## File Structure

```
src/
├── domain/                    # Core business logic
│   ├── models/
│   │   └── Book.ts           # Business entity
│   └── ports/
│       └── BookRepository.ts # Repository port (interface)
│
├── application/               # Application business rules
│   └── use-cases/
│       ├── ListBooks.ts      # Use case implementation
│       ├── CreateBook.ts     # Use case implementation
│       ├── GetBookById.ts    # Use case implementation
│       ├── UpdateBook.ts     # Use case implementation
│       ├── DeleteBook.ts     # Use case implementation
│       └── SearchBooks.ts    # Use case implementation
│
├── adapters/                  # Interface adapters
│   ├── in/                   # Inbound adapters
│   │   └── http/
│   │       └── BookController.ts # HTTP controller
│   └── out/                  # Outbound adapters
│       └── db/
│           ├── InMemoryBookRepository.ts
│           └── SQLiteBookRepository.ts
│
├── config/                    # Configuration
│   ├── di-container.ts       # Dependency injection
│   ├── decorators.ts         # DI decorators
│   ├── dependencies.ts       # Service registration
│   └── tokens.ts             # DI tokens
│
└── main.ts                   # Application entry point
```

## Benefits of Hexagonal Architecture

1. **Testability**: Easy to mock ports and test adapters in isolation
2. **Maintainability**: Clear separation between core and external concerns
3. **Flexibility**: Easy to swap adapters without changing core logic
4. **Independence**: Core business logic independent of external frameworks
5. **Scalability**: Easy to add new adapters for different interfaces
6. **Technology Agnostic**: Core logic can work with any technology stack

## Testing Strategy

### **Unit Tests**
- **Domain Models**: Test business entities and rules
- **Use Cases**: Test business logic with mocked ports
- **Adapters**: Test adapter implementations with mocked dependencies

### **Integration Tests**
- **Port-Adapter Integration**: Test port implementations
- **End-to-End**: Test complete request flows

### **Test Structure**
```
tests/
├── application/use-cases/     # Use case tests
├── infrastructure/repositories/ # Repository adapter tests
├── interfaces/controllers/    # Controller adapter tests
└── config/                   # Configuration tests
```

## Comparison with Clean Architecture

| Aspect | Clean Architecture | Hexagonal Architecture |
|--------|-------------------|----------------------|
| **Focus** | Dependency direction | Ports and adapters |
| **Terminology** | Layers | Adapters |
| **Structure** | Vertical layers | Hexagonal shape |
| **Dependencies** | Inward pointing | Through ports |
| **Flexibility** | Framework independence | Technology agnostic |

Both architectures achieve similar goals but use different metaphors and terminology to describe the same principles of separation of concerns and dependency inversion. 