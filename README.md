# React Authentication with JWT (Access + Refresh)

A full-stack authentication system implementing JWT access tokens and refresh tokens using React, Next.js, NestJS, and Prisma.

## 🚀 Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Access & Refresh Tokens** - Dual token system for enhanced security
- ✅ **Auto Token Refresh** - Seamless token refresh on expiration using Axios interceptors
- ✅ **Protected Routes** - Route-level authentication guards
- ✅ **React Query Integration** - Powerful server state management
- ✅ **React Hook Form** - Form validation and management
- ✅ **Zustand Store** - Lightweight state management for access tokens
- ✅ **Responsive UI** - Beautiful, modern interface with Tailwind CSS
- ✅ **Error Handling** - Comprehensive error handling and user feedback
- ✅ **TypeScript** - Full type safety across frontend and backend

## 🏗️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP client with interceptors
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form handling
- **Zustand** - Client state management

### Backend

- **NestJS** - Node.js framework
- **Prisma** - ORM for database access
- **PostgreSQL** - Database
- **JWT** - Token generation and validation
- **Bcrypt** - Password hashing
- **Passport** - Authentication middleware

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Docker (optional, for running PostgreSQL)

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd ia07-react-auth-with-jwt
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database configuration
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ia07_auth?schema=public"
# JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
# JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key-change-this-in-production"
# JWT_EXPIRATION="15m"
# JWT_REFRESH_EXPIRATION="7d"
# PORT=3001

# Start PostgreSQL (if using Docker)
docker-compose up -d

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3001`

**API Documentation (Swagger):** `http://localhost:3001/api`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file (already created, or create from example)
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

Once the backend is running, you can access the interactive Swagger API documentation at:

**`http://localhost:3001/api`**

The Swagger UI provides:

- Interactive API testing
- Request/response schemas
- Authentication testing
- Complete API reference

## 🌐 API Endpoints

### Authentication Endpoints

| Method | Endpoint         | Description          | Auth Required       |
| ------ | ---------------- | -------------------- | ------------------- |
| POST   | `/auth/register` | Register new user    | No                  |
| POST   | `/auth/login`    | Login user           | No                  |
| POST   | `/auth/refresh`  | Refresh access token | Yes (Refresh Token) |
| POST   | `/auth/logout`   | Logout user          | Yes                 |
| GET    | `/auth/me`       | Get current user     | Yes                 |

### Request/Response Examples

#### Register

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
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

#### Login

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: (Same as register)
```

#### Refresh Token

```bash
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Get Current User

```bash
GET /auth/me
Authorization: Bearer eyJhbGc...

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔐 Authentication Flow

### 1. Login/Register Flow

```
User → Login Form → POST /auth/login → Backend
                                          ↓
                                    Validate Credentials
                                          ↓
                                    Generate Tokens
                                          ↓
Frontend ← Access Token (Memory) + Refresh Token (localStorage)
    ↓
Dashboard
```

### 2. Protected Route Access

```
User → Protected Route → Axios Interceptor → Add Access Token
                                                    ↓
                                              Backend validates
                                                    ↓
                                              Return Data
```

### 3. Token Refresh Flow

```
User → API Request → 401 Unauthorized
                          ↓
                    Axios Interceptor detects 401
                          ↓
                    POST /auth/refresh with Refresh Token
                          ↓
                    Get New Tokens
                          ↓
                    Update Access Token (Memory)
                    Update Refresh Token (localStorage)
                          ↓
                    Retry Original Request
```

## 📁 Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── dto/                 # Data transfer objects
│   │   ├── strategies/          # Passport strategies
│   │   ├── auth.controller.ts   # Auth endpoints
│   │   ├── auth.service.ts      # Auth business logic
│   │   └── auth.module.ts       # Auth module
│   ├── users/                   # User module
│   │   ├── dto/
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── prisma/                  # Prisma service
│   ├── common/                  # Shared code
│   │   ├── decorators/          # Custom decorators
│   │   └── guards/              # Auth guards
│   └── main.ts                  # Application entry
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
└── package.json
```

### Frontend Structure

```
frontend/
├── app/
│   ├── (auth)/                  # Auth pages group
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/             # Protected pages group
│   │   ├── dashboard/
│   │   └── layout.tsx           # Protected layout with navbar
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── providers.tsx            # React Query provider
├── components/
│   ├── LoginForm.tsx            # Login form with validation
│   ├── RegisterForm.tsx         # Register form
│   ├── Navbar.tsx               # Navigation bar
│   ├── ErrorBoundary.tsx        # Error boundary
│   └── LoadingSpinner.tsx       # Loading component
├── hooks/
│   ├── useAuth.ts               # Auth mutations hook
│   ├── useUser.ts               # User query hook
│   └── useAuthCheck.ts          # Route protection hooks
├── lib/
│   ├── api/
│   │   ├── axios.ts             # Axios instance + interceptors
│   │   └── auth.ts              # Auth API functions
│   ├── stores/
│   │   └── auth.store.ts        # Zustand auth store
│   └── utils/
│       └── error-handler.ts     # Error handling utilities
├── types/
│   └── auth.ts                  # TypeScript types
└── package.json
```

## 🔑 Key Implementation Details

### Token Storage Strategy

- **Access Token**: Stored in memory using Zustand (cleared on page refresh)
- **Refresh Token**: Stored in localStorage (persists across page refreshes)

This approach provides a balance between security and user experience:

- Access tokens are short-lived (15 minutes) and not accessible via XSS
- Refresh tokens are longer-lived (7 days) and used only to obtain new access tokens
- On page refresh, the app uses the refresh token to get a new access token

### Axios Interceptors

**Request Interceptor**: Automatically attaches the access token to all requests

```typescript
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
```

**Response Interceptor**: Handles 401 errors and refreshes tokens automatically

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token logic
      // Retry original request
    }
    return Promise.reject(error);
  }
);
```

### Protected Routes

Routes are protected using custom hooks:

```typescript
// Protected route
export default function DashboardPage() {
  useAuthCheck(); // Redirects to /login if not authenticated
  // ...
}

// Guest route (login/register)
export default function LoginPage() {
  useGuestCheck(); // Redirects to /dashboard if authenticated
  // ...
}
```

## 🧪 Testing the Application

1. **Register a new user**

   - Navigate to `http://localhost:3000/register`
   - Fill in the form and submit
   - You should be redirected to the dashboard

2. **Test protected route**

   - Try accessing `/dashboard` without logging in
   - You should be redirected to `/login`

3. **Test logout**

   - Click the logout button in the navbar
   - You should be redirected to the login page

4. **Test token refresh**
   - Wait 15 minutes (or change JWT_EXPIRATION to 1m for testing)
   - Make a request to a protected route
   - The token should refresh automatically without logging you out

## 🚀 Deployment

### Backend Deployment (Railway/Render/Fly.io)

1. Push your code to GitHub
2. Connect your repository to Railway/Render
3. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `JWT_EXPIRATION`
   - `JWT_REFRESH_EXPIRATION`
   - `PORT`
4. Deploy!

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` (your backend URL)
4. Deploy!

## 📝 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
PORT=3001
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ as part of IA07 course assignment

## 📞 Support

For questions or issues, please open an issue on GitHub.
