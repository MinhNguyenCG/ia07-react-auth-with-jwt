# Frontend - Next.js Authentication App

Frontend application built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📦 Dependencies

### Core

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety

### State Management

- **@tanstack/react-query** - Server state management
- **Zustand** - Client state management (access token in memory)

### Form & Validation

- **React Hook Form** - Form management and validation

### HTTP & API

- **Axios** - HTTP client with interceptors

### Styling

- **Tailwind CSS v4** - Utility-first CSS framework

## 🏗️ Project Structure

```
app/
├── (auth)/                  # Auth pages (route group)
│   ├── login/
│   │   └── page.tsx         # Login page
│   └── register/
│       └── page.tsx         # Register page
├── (protected)/             # Protected pages (route group)
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard page
│   └── layout.tsx           # Layout with navbar for protected routes
├── layout.tsx               # Root layout with providers
├── page.tsx                 # Landing page
└── providers.tsx            # React Query provider

components/
├── ErrorBoundary.tsx        # Error boundary component
├── LoadingSpinner.tsx       # Loading spinner component
├── LoginForm.tsx            # Login form with validation
├── RegisterForm.tsx         # Register form with validation
└── Navbar.tsx               # Navigation bar

hooks/
├── useAuth.ts               # Auth mutations (login, register, logout)
├── useUser.ts               # User query hook
└── useAuthCheck.ts          # Route protection hooks

lib/
├── api/
│   ├── axios.ts             # Axios instance with interceptors
│   └── auth.ts              # Auth API functions
├── stores/
│   └── auth.store.ts        # Zustand store for access token
└── utils/
    └── error-handler.ts     # Error handling utilities

types/
└── auth.ts                  # TypeScript interfaces and types
```

## 🔐 Authentication System

### Token Storage

**Access Token (Memory)**

- Stored in Zustand store
- Cleared on page refresh
- Short-lived (15 minutes)
- Used for API authentication

**Refresh Token (LocalStorage)**

- Persists across page refreshes
- Long-lived (7 days)
- Used to obtain new access tokens

### Axios Interceptors

**Request Interceptor**

```typescript
// Automatically attach access token to requests
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
```

**Response Interceptor**

```typescript
// Handle 401 errors and refresh token automatically
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt to refresh token
      // Retry original request with new token
      // Logout if refresh fails
    }
    return Promise.reject(error);
  }
);
```

### React Query Integration

**Mutations for Auth Actions**

```typescript
const { login, isLoggingIn, loginError } = useAuth();

// Login mutation
login({ email, password });
```

**Queries for Data Fetching**

```typescript
const { user, isLoading, isAuthenticated } = useUser();
```

### Form Validation with React Hook Form

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

<input
  {...register("email", {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  })}
/>;
{
  errors.email && <p>{errors.email.message}</p>;
}
```

## 🛡️ Protected Routes

### Route Protection Hooks

**useAuthCheck** - Protects routes from unauthenticated users

```typescript
export default function DashboardPage() {
  useAuthCheck(); // Redirects to /login if not authenticated
  // ...
}
```

**useGuestCheck** - Redirects authenticated users away from auth pages

```typescript
export default function LoginPage() {
  useGuestCheck(); // Redirects to /dashboard if authenticated
  // ...
}
```

## 🎨 UI Components

### Forms

- **LoginForm** - Email and password login
- **RegisterForm** - User registration with validation

### Layout

- **Navbar** - Navigation with user menu and logout
- **ErrorBoundary** - Catches and displays errors
- **LoadingSpinner** - Loading states

## 🔄 Authentication Flow

### Login Flow

1. User submits credentials via LoginForm
2. `useAuth` mutation sends POST to `/auth/login`
3. On success:
   - Access token saved to Zustand store (memory)
   - Refresh token saved to localStorage
   - User redirected to dashboard
4. On error:
   - Error message displayed

### Token Refresh Flow

1. API request returns 401 Unauthorized
2. Axios interceptor catches error
3. Refresh token sent to `/auth/refresh`
4. New tokens received and stored
5. Original request retried with new access token
6. If refresh fails, user logged out

### Logout Flow

1. User clicks logout button
2. `useAuth` mutation calls `/auth/logout`
3. Tokens cleared from memory and localStorage
4. React Query cache cleared
5. User redirected to login page

## 📝 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production, update with your backend URL.

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
4. Deploy!

The app will be available at your Vercel domain.

### Other Platforms

Build the app:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## 🎯 Key Features

- ✅ Form validation with React Hook Form
- ✅ Protected route system
- ✅ Automatic token refresh
- ✅ Error handling and display
- ✅ Loading states
- ✅ Responsive design
- ✅ Type-safe with TypeScript
- ✅ Modern UI with Tailwind CSS

## 🔧 Customization

### Adding New Protected Routes

1. Create page in `app/(protected)/your-route/page.tsx`
2. Add `useAuthCheck()` hook
3. Navbar will automatically appear (from layout)

### Adding New API Endpoints

1. Add function to `lib/api/auth.ts` or create new file
2. Use axios instance for automatic token attachment
3. Handle errors with error-handler utility

### Custom Styling

Tailwind CSS is configured in `tailwind.config.ts`. Customize:

- Colors
- Fonts
- Spacing
- Breakpoints
