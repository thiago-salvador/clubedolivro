# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Clube do Livro" is a React-based web application for an online book club/learning platform featuring:
- Public landing page with enrollment
- Protected student area with lessons, community features, and debates
- Admin dashboard for content and user management
- Authentication system with role-based access
- Payment processing and membership management

## Common Development Commands

```bash
# Navigate to project directory
cd clube-do-livro

# Install dependencies
npm install

# Start development server (localhost:3000)
npm start

# Build for production
npm run build

# Build optimized for Netlify deployment
npm run build:netlify

# Run tests in watch mode
npm test

# Run a single test file
npm test -- path/to/test.test.tsx --watchAll=false
```

## High-Level Architecture

### Core Technologies
- **React 18** with TypeScript
- **React Router v6** for routing
- **Tailwind CSS** with custom color palette
- **Context API** for state management (Auth, Theme)
- **Create React App** as build tool

### Project Structure
```
src/
├── components/          # Reusable components
│   ├── aluna/          # Student area components
│   ├── admin/          # Admin components
│   ├── auth/           # Auth-related components
│   ├── layout/         # Landing page sections
│   └── ui/             # Generic UI components
├── contexts/           # React Context providers
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   └── aluna/          # Student area pages
├── services/           # Business logic & API services
├── types/              # TypeScript type definitions
├── utils/              # Helper functions
└── hooks/              # Custom React hooks
```

### Key Architectural Patterns

1. **Service Layer Pattern**: Business logic separated into service files (e.g., `auth.service.ts`, `course.service.ts`)
2. **Lazy Loading**: Pages loaded via `React.lazy()` through `utils/lazyImports.ts`
3. **Protected Routes**: Auth-based route protection via `ProtectedRoute` and `AdminProtectedRoute` components
4. **Singleton Services**: Services use singleton pattern for consistent state management
5. **Mock API**: Currently using localStorage for data persistence (prepared for future API integration)

### Design System

**Custom Tailwind Colors**:
- `terracota`: Main brand color (#B8654B)
- `bege-claro`: Light background (#F5E6D3)
- `verde-oliva`, `verde-floresta`: Green accents
- `dourado`: Gold accent (#D4A574)
- `marrom-escuro`: Dark brown (#4D381B)

**Typography**:
- Headers: Cormorant Garamond (serif)
- Body: Montserrat (sans-serif)

### Code Conventions

1. **TypeScript**: Strict mode enabled, comprehensive typing
2. **Components**: Functional components with hooks
3. **Naming**: 
   - Components: PascalCase (`Dashboard.tsx`)
   - Services: camelCase (`auth.service.ts`)
   - Constants: UPPER_SNAKE_CASE
4. **State Management**: React Context for global state
5. **Styling**: Tailwind CSS classes, mobile-first responsive design

### Current Development Status

**Admin Dashboard Progress**:
- Phase 1 (Authentication): ✅ Complete
- Phase 2 (Course Management): 45% complete (9/20 tasks)
- Phase 3 (Student Management): Pending
- Phase 4 (Notifications): Pending
- Phase 5 (Communication): Pending
- Phase 6 (API Integration): Pending

**Key Completed Features**:
- Admin authentication system
- Course CRUD operations
- Content upload with Vimeo integration
- Student area with lessons and community
- Responsive design across all pages

### Important Services

- `auth.service.ts`: Authentication logic and user management
- `course.service.ts`: Course CRUD operations and content management
- `student.service.ts`: Student management and enrollment
- `notification.service.ts`: In-app notifications
- `whatsapp.service.ts`: WhatsApp integration for communications

### Testing Approach

Tests are located alongside components in `__tests__` directories. Run tests with `npm test`.

### Deployment

The application is configured for Netlify deployment with:
- `netlify.toml` configuration
- `_redirects` file for SPA routing
- Build optimization via `npm run build:netlify`