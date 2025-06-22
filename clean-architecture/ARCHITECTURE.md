# Clean Architecture Implementation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLEAN ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    INTERFACES LAYER                        │ │
│  │  (Controllers, Presenters, Gateways)                       │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │              BookController                             │ │ │
│  │  │  - Handles HTTP requests                                │ │ │
│  │  │  - Delegates to use cases                               │ │ │
│  │  │  - Returns HTTP responses                               │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                  APPLICATION LAYER                         │ │
│  │  (Use Cases, Application Services)                         │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │              ListBooks                                  │ │ │
│  │  │  - Business logic                                       │ │ │
│  │  │  - Orchestrates domain objects                          │ │ │
│  │  │  - Uses repository interfaces                           │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    DOMAIN LAYER                            │ │
│  │  (Entities, Value Objects, Domain Services)                │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │              Book Entity                                │ │ │
│  │  │  - Core business entity                                 │ │ │
│  │  │  - Contains business rules                              │ │ │
│  │  │  - Independent of frameworks                            │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │           BookRepository Interface                      │ │ │
│  │  │  - Defines contract for data access                     │ │ │
│  │  │  - Domain-driven design                                 │ │ │
│  │  │  - Framework independent                                │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 INFRASTRUCTURE LAYER                       │ │
│  │  (Frameworks, Drivers, External Interfaces)                │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │         InMemoryBookRepository                          │ │ │
│  │  │  - Implements BookRepository interface                  │ │ │
│  │  │  - In-memory data storage                               │ │ │
│  │  │  - Used for development/testing                         │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │         SQLiteBookRepository                            │ │ │
│  │  │  - Implements BookRepository interface                  │ │ │
│  │  │  - SQLite database storage                              │ │ │
│  │  │  - Used for production                                  │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Dependency Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Express   │───▶│ Controller  │───▶│  Use Case   │
│   (HTTP)    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │ Repository  │
                                       │ Interface   │
                                       └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │Repository   │
                                       │Implementation│
                                       └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │   Domain    │
                                       │   Entity    │
                                       └─────────────┘
```

## Correct Dependency Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Express   │───▶│ Controller  │───▶│  Use Case   │
│   (HTTP)    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │ Repository  │
                                       │ Interface   │
                                       └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │Repository   │
                                       │Implementation│
                                       └─────────────┘
                                              │
                                              ▼
                                       ┌─────────────┐
                                       │   Domain    │
                                       │   Entity    │
                                       └─────────────┘
```

**Actual Code Dependencies on Domain:**
1. **Application Layer** (Use Cases) → **Domain Entities** + **Domain Interfaces**
   - `ListBooks` imports `Book` entity and `BookRepository` interface
2. **Infrastructure Layer** (Repository Implementations) → **Domain Entities** + **Domain Interfaces**
   - `InMemoryBookRepository` imports `Book` entity and `BookRepository` interface
   - `SQLiteBookRepository` imports `Book` entity and `BookRepository` interface

**Key Point:** Both Application and Infrastructure layers depend on Domain, but Domain depends on nothing outside itself.

## Key Principles Implemented

### 1. **Dependency Rule**
- Dependencies point inward
- Domain layer has no dependencies on outer layers
- Infrastructure depends on domain, not vice versa

### 2. **Dependency Injection**
```typescript
// Use case depends on interface, not implementation
@inject("BookRepository")
export class ListBooks {
  constructor(private bookRepository: BookRepository) {}
}
```

### 3. **Interface Segregation**
```typescript
// Domain defines the contract
export interface BookRepository {
  findAll(): Promise<Book[]>;
  findById(id: string): Promise<Book | null>;
  save(book: Book): Promise<Book>;
}
```

### 4. **Single Responsibility**
- Each layer has a specific responsibility
- Controllers handle HTTP concerns
- Use cases handle business logic
- Entities represent business concepts

## File Structure

```
src/
├── domain/                    # Core business logic
│   ├── entities/
│   │   └── Book.ts           # Business entity
│   └── repositories/
│       └── BookRepository.ts # Repository interface
│
├── application/               # Application business rules
│   └── use-cases/
│       └── ListBooks.ts      # Use case implementation
│
├── interfaces/                # Interface adapters
│   └── controllers/
│       └── BookController.ts # HTTP controller
│
├── infrastructure/            # External concerns
│   └── repositories/
│       ├── InMemoryBookRepository.ts
│       └── SQLiteBookRepository.ts
│
├── config/                    # Configuration
│   ├── di-container.ts       # Dependency injection
│   ├── decorators.ts         # DI decorators
│   └── dependencies.ts       # Service registration
│
└── main.ts                   # Application entry point
```

## Benefits

1. **Testability**: Easy to mock dependencies
2. **Maintainability**: Clear separation of concerns
3. **Flexibility**: Easy to swap implementations
4. **Independence**: Domain logic independent of frameworks
5. **Scalability**: Easy to add new features

## Testing Strategy

- **Unit Tests**: Test each layer in isolation
- **Integration Tests**: Test layer interactions
- **Mock Dependencies**: Use mock repositories for testing
- **Dependency Injection**: Enables easy testing setup 