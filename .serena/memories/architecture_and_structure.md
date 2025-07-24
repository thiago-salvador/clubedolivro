# Architecture and Code Structure

## Project Structure
```
clube-do-livro/
├── src/
│   ├── components/          # Reusable components
│   │   ├── aluna/          # Student area components
│   │   ├── auth/           # Auth-related components
│   │   ├── layout/         # Landing page sections
│   │   └── ui/             # Generic UI components
│   ├── contexts/           # React Context providers (Auth, Theme)
│   ├── pages/              # Page components
│   │   └── aluna/          # Student area pages
│   ├── services/           # Business logic & API services
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions and utilities
│   └── hooks/              # Custom React hooks
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Key Architectural Patterns
1. **Lazy Loading**: Most pages use React.lazy() for code splitting (see `src/utils/lazyImports.ts`)
2. **Protected Routes**: Auth-based route protection via `ProtectedRoute` component
3. **Theme System**: Dark mode support with ThemeContext and Tailwind's darkMode class
4. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
5. **Service Layer**: Business logic separated into service files

## Core Services
- `auth.service.ts` - Authentication logic
- `payment.service.ts` - Payment processing
- `storage.service.ts` - Local storage management
- `email.service.ts` - Email notifications
- `whatsapp.service.ts` - WhatsApp integration
- `cache.service.ts` - Caching functionality
- `notification.service.ts` - Notifications
- `reading-progress.service.ts` - Progress tracking