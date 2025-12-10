# React Authentication with JWT (Access + Refresh)

Hệ thống xác thực full-stack sử dụng JWT access tokens và refresh tokens được xây dựng với React, Next.js, NestJS và Prisma.

## 🚀 Bắt Đầu Nhanh

### Yêu Cầu Hệ Thống

- Node.js 18+ và npm
- Cơ sở dữ liệu PostgreSQL
- Docker (tùy chọn, để chạy PostgreSQL)

### Cài Đặt & Chạy

#### 1. Cài Đặt Backend

```bash
cd backend

# Cài đặt các dependencies
npm install

# Tạo file .env
cp .env.example .env

# Cập nhật .env với cấu hình của bạn:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ia07_auth?schema=public"
# JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
# JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key-change-this-in-production"
# JWT_EXPIRATION="15m"
# JWT_REFRESH_EXPIRATION="7d"
# PORT=3001

# Khởi động PostgreSQL (nếu sử dụng Docker)
docker-compose up -d

# Chạy Prisma migrations
npx prisma migrate dev

# Tạo Prisma Client
npx prisma generate

# Khởi động development server
npm run start:dev
```

**Backend chạy tại:** `http://localhost:3001`  
**Tài liệu API (Swagger):** `http://localhost:3001/api`

#### 2. Cài Đặt Frontend

```bash
cd frontend

# Cài đặt các dependencies
npm install

# Tạo file .env.local (nếu chưa có)
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Khởi động development server
npm run dev
```

**Frontend chạy tại:** `http://localhost:3000`

### Truy Cập Dự Án

- **Ứng dụng Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Tài liệu API (Swagger):** http://localhost:3001/api

## 🎯 Tính Năng

- ✅ **Xác Thực JWT** - Xác thực dựa trên token an toàn
- ✅ **Access & Refresh Tokens** - Hệ thống token kép để tăng cường bảo mật
- ✅ **Tự Động Làm Mới Token** - Tự động làm mới token khi hết hạn sử dụng Axios interceptors
- ✅ **Bảo Vệ Routes** - Bảo vệ routes ở cấp độ authentication guards
- ✅ **Tích Hợp React Query** - Quản lý trạng thái server mạnh mẽ
- ✅ **React Hook Form** - Xác thực và quản lý form
- ✅ **Zustand Store** - Quản lý trạng thái nhẹ cho access tokens
- ✅ **Giao Diện Responsive** - Giao diện đẹp, hiện đại với Tailwind CSS
- ✅ **Xử Lý Lỗi** - Xử lý lỗi toàn diện và phản hồi người dùng
- ✅ **TypeScript** - Đảm bảo type safety đầy đủ cho frontend và backend

## 🏗️ Tech Stack

### Frontend

- **Next.js 16** - React framework với App Router
- **React 19** - Thư viện UI
- **TypeScript** - Đảm bảo type safety
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP client với interceptors
- **React Query (TanStack Query)** - Quản lý trạng thái server
- **React Hook Form** - Xử lý form
- **Zustand** - Quản lý trạng thái client

### Backend

- **NestJS** - Node.js framework
- **Prisma** - ORM để truy cập database
- **PostgreSQL** - Database
- **JWT** - Tạo và xác thực token
- **Bcrypt** - Mã hóa mật khẩu
- **Passport** - Authentication middleware

## 📚 API Endpoints

### Authentication Endpoints

| Method | Endpoint         | Mô Tả                             | Yêu Cầu Xác Thực   |
| ------ | ---------------- | --------------------------------- | ------------------ |
| POST   | `/auth/register` | Đăng ký người dùng mới            | Không              |
| POST   | `/auth/login`    | Đăng nhập người dùng              | Không              |
| POST   | `/auth/refresh`  | Làm mới access token              | Có (Refresh Token) |
| POST   | `/auth/logout`   | Đăng xuất người dùng              | Có                 |
| GET    | `/auth/me`       | Lấy thông tin người dùng hiện tại | Có                 |

### Ví Dụ Request/Response

#### Đăng Ký

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

#### Đăng Nhập

```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: (Giống như đăng ký)
```

#### Làm Mới Token

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

#### Lấy Thông Tin Người Dùng Hiện Tại

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

## 🔐 Luồng Xác Thực

### 1. Luồng Đăng Nhập/Đăng Ký

```
Người Dùng → Form Đăng Nhập → POST /auth/login → Backend
                                                      ↓
                                                Xác Thực Thông Tin
                                                      ↓
                                                Tạo Tokens
                                                      ↓
Frontend ← Access Token (Memory) + Refresh Token (localStorage)
    ↓
Dashboard
```

### 2. Truy Cập Route Được Bảo Vệ

```
Người Dùng → Protected Route → Axios Interceptor → Thêm Access Token
                                                          ↓
                                                    Backend xác thực
                                                          ↓
                                                    Trả Về Dữ Liệu
```

### 3. Luồng Làm Mới Token

```
Người Dùng → API Request → 401 Unauthorized
                              ↓
                    Axios Interceptor phát hiện 401
                              ↓
                    POST /auth/refresh với Refresh Token
                              ↓
                    Nhận Tokens Mới
                              ↓
                    Cập Nhật Access Token (Memory)
                    Cập Nhật Refresh Token (localStorage)
                              ↓
                    Thử Lại Request Ban Đầu
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

## 🔑 Chi Tiết Triển Khai

### Chiến Lược Lưu Trữ Token

- **Access Token**: Lưu trong memory sử dụng Zustand (bị xóa khi refresh trang)
- **Refresh Token**: Lưu trong localStorage (giữ nguyên sau khi refresh trang)

Cách tiếp cận này cân bằng giữa bảo mật và trải nghiệm người dùng:

- Access tokens có thời gian sống ngắn (15 phút) và không thể truy cập qua XSS
- Refresh tokens có thời gian sống dài hơn (7 ngày) và chỉ được sử dụng để lấy access tokens mới
- Khi refresh trang, ứng dụng sử dụng refresh token để lấy access token mới

### Axios Interceptors

**Request Interceptor**: Tự động đính kèm access token vào tất cả các request

```typescript
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
```

**Response Interceptor**: Xử lý lỗi 401 và tự động làm mới tokens

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Logic làm mới token
      // Thử lại request ban đầu
    }
    return Promise.reject(error);
  }
);
```

### Protected Routes

Routes được bảo vệ bằng các custom hooks:

```typescript
// Protected route
export default function DashboardPage() {
  useAuthCheck(); // Chuyển hướng đến /login nếu chưa xác thực
  // ...
}

// Guest route (login/register)
export default function LoginPage() {
  useGuestCheck(); // Chuyển hướng đến /dashboard nếu đã xác thực
  // ...
}
```

## 📝 Biến Môi Trường

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

## 📖 Tài Liệu Bổ Sung

- [API Documentation](./API.md) - Tài liệu API chi tiết
- [Deployment Guide](./DEPLOYMENT.md) - Hướng dẫn triển khai toàn diện
- [Swagger Documentation](./SWAGGER.md) - Cài đặt và sử dụng Swagger
- [Project Summary](./PROJECT_SUMMARY.md) - Tổng quan và kiến trúc dự án

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng gửi Pull Request.

## 📄 Giấy Phép

Dự án này là mã nguồn mở và có sẵn theo giấy phép MIT License.

## 👨‍💻 Tác Giả

Được xây dựng với ❤️ như một phần của bài tập khóa học IA07

## 📞 Hỗ Trợ

Đối với câu hỏi hoặc vấn đề, vui lòng mở issue trên GitHub.
