# FitCoach Backend

NestJS GraphQL backend for the FitCoach fitness trainer SaaS platform.

## 🚀 Features

- **NestJS Framework**: Built with the powerful NestJS framework
- **GraphQL API**: Code-first GraphQL implementation with Apollo Server
- **Database**: Prisma ORM for type-safe database access
- **Error Handling**: Comprehensive error handling with Sentry integration
- **Testing**: Jest unit and E2E tests
- **Code Quality**: ESLint and Prettier for code consistency

## 📋 Prerequisites

- Node.js >= 18
- pnpm >= 8
- PostgreSQL database

## 🛠️ Installation

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Update DATABASE_URL in .env file with your database credentials

# Generate Prisma Client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate
```

## 🏃 Running the Application

```bash
# Development mode with hot reload
pnpm dev

# Production mode
pnpm build
pnpm start:prod

# Debug mode
pnpm start:debug
```

The application will be available at:
- **API**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/graphql

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:cov

# Run E2E tests
pnpm test:e2e
```

## 📦 Database

```bash
# Open Prisma Studio
pnpm prisma:studio

# Create a new migration
pnpm prisma:migrate

# Deploy migrations (production)
pnpm prisma:deploy
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/fitcoach
JWT_SECRET=your-secret-key
SENTRY_DSN=your-sentry-dsn
CORS_ORIGIN=http://localhost:3001
```

See `.env.example` for all available options.

## 📁 Project Structure

```
src/
├── common/             # Shared utilities
│   ├── errors/        # Custom error classes
│   ├── filters/       # Exception filters
│   ├── interceptors/  # Request/response interceptors
│   └── scalars/       # GraphQL custom scalars
├── config/            # Configuration modules
├── modules/           # Feature modules
├── prisma/            # Prisma service and module
├── app.module.ts      # Root application module
└── main.ts            # Application entry point
```

## 🎨 Code Style

```bash
# Run linter
pnpm lint

# Format code
pnpm format
```

## 📝 GraphQL Schema

The GraphQL schema is auto-generated in code-first approach. The generated schema file is located at `schema.gql` after running the application.

## 🔐 Error Handling

The application uses a comprehensive error handling system:

- Custom exception classes for different error types
- Global exception filter for consistent error formatting
- Sentry integration for error monitoring
- Request/response logging

## 🚢 Deployment

The application includes:
- Docker support with multi-stage builds
- GitHub Actions CI/CD workflows
- Environment-based configuration

## 📄 License

ISC

## 👥 Authors

FitCoach Development Team
