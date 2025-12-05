# Backend - NestJS Authentication API

Backend API built with NestJS, Prisma, and PostgreSQL for JWT authentication.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start PostgreSQL
docker-compose up -d

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run start:dev
```

Server will run on `http://localhost:3001`

**Swagger API Documentation:** `http://localhost:3001/api`

## 🔧 Available Scripts

- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start debug mode
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

## 📦 Dependencies

### Core

- **NestJS** - Backend framework
- **Prisma** - ORM
- **@nestjs/jwt** - JWT implementation
- **@nestjs/passport** - Authentication middleware
- **bcrypt** - Password hashing

### Database

- **PostgreSQL** - Database
- **Prisma Client** - Database client

## 🔐 Authentication Endpoints

### POST /auth/register

Register a new user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### POST /auth/login

Login with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### POST /auth/refresh

Refresh access token.

**Request Body:**

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### POST /auth/logout

Logout and invalidate refresh token.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGc..." // optional
}
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

### GET /auth/me

Get current user information.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🗄️ Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  refreshTokens RefreshToken[]

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT access tokens (15-minute expiration)
- JWT refresh tokens (7-day expiration)
- Token rotation on refresh
- Secure token validation with Passport strategies
- CORS enabled for frontend
- Global validation pipes

## 🌍 CORS Configuration

CORS is configured in `main.ts` to allow requests from:

- `http://localhost:3000` (frontend development)
- `http://localhost:3001` (backend)

Update these URLs for production deployment.

## 📝 Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ia07_auth?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key-change-this-in-production"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Server
PORT=3001
```

## 🐳 Docker Setup

Start PostgreSQL using Docker Compose:

```bash
docker-compose up -d
```

This will start PostgreSQL on port 5432 with:

- Username: `postgres`
- Password: `postgres`
- Database: `ia07_auth`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📂 Project Structure

```
src/
├── auth/
│   ├── dto/                 # Data transfer objects
│   ├── interfaces/          # TypeScript interfaces
│   ├── strategies/          # Passport strategies
│   ├── auth.controller.ts   # Auth endpoints
│   ├── auth.service.ts      # Auth business logic
│   └── auth.module.ts       # Auth module
├── users/
│   ├── dto/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── prisma/
│   ├── prisma.service.ts    # Prisma service
│   └── prisma.module.ts     # Prisma module
├── common/
│   ├── decorators/
│   │   └── current-user.decorator.ts
│   └── guards/
│       ├── jwt-auth.guard.ts
│       └── refresh-token.guard.ts
├── app.module.ts            # Root module
└── main.ts                  # Application entry point
```
