# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on localhost:3000)
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

## 🏗️ Architecture Overview

### Tech Stack
- **React 18** with TypeScript
- **React Router v6** for routing
- **Tailwind CSS** for styling with custom color palette
- **Context API** for state management (Auth, Theme)
- **Lucide React** and **React Icons** for icons
- **date-fns** for date formatting
- **Create React App** as build tool

### Project Structure
```
clube-do-livro/
├── src/
│   ├── components/          # Reusable components
│   │   ├── aluna/          # Student area components
│   │   ├── auth/           # Auth-related components
│   │   ├── layout/         # Landing page sections
│   │   └── ui/             # Generic UI components
│   ├── contexts/           # React Context providers
│   ├── pages/              # Page components
│   │   └── aluna/          # Student area pages
│   ├── services/           # Business logic & API services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Helper functions and utilities
├── public/                 # Static assets
└── docs/                   # Documentation
```

### Key Architectural Patterns

1. **Lazy Loading**: Most pages use React.lazy() for code splitting (see `src/utils/lazyImports.ts`)
2. **Protected Routes**: Auth-based route protection via `ProtectedRoute` component
3. **Theme System**: Dark mode support with ThemeContext and Tailwind's darkMode class
4. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
5. **Service Layer**: Business logic separated into service files

### Core Services
- `auth.service.ts` - Authentication logic
- `payment.service.ts` - Payment processing
- `storage.service.ts` - Local storage management
- `email.service.ts` - Email notifications
- `whatsapp.service.ts` - WhatsApp integration

## 🎯 Current Application Status

### Public Pages
- **Landing Page** (`/`) - Complete with multiple sections
- **Login** (`/login`) - Implemented
- **Checkout** (`/checkout`) - Fully functional with validations

### Student Area (`/aluna`)
- **Dashboard** - Implemented
- **Community** - Feed + New post functionality
- **Lessons** - 5 chapters with video/audio content
- **Debates** - Indicações and Relacionamento sections done

### Pending Implementation
- Debates: Trabalho, Amizade
- Avisos Importantes
- Links Úteis  
- Configurações
- Exercise and Meeting content for lessons

## 🎨 Design System

### Custom Colors (Tailwind Config)
- **terracota**: Main brand color (#B8654B)
- **bege-claro**: Light background (#F5E6D3)
- **verde-oliva**: Olive green accent
- **verde-floresta**: Forest green accent
- **dourado**: Gold accent
- **marrom-escuro**: Dark brown (#4D381B)

### Fonts
- **Serif**: Cormorant Garamond (elegant headers)
- **Sans**: Montserrat (body text)

## 🚢 Deployment

The app is configured for Netlify deployment:
- Build command: `npm run build:netlify`
- Publish directory: `build`
- Node version: 18
- Includes performance optimizations and security headers
- SPA redirects configured

## 📝 Important Notes

1. **Authentication**: Uses context-based auth with protected routes
2. **Responsive**: Ensure all new components follow mobile-first approach
3. **Accessibility**: Use proper ARIA labels and semantic HTML
4. **Performance**: Leverage lazy loading for new pages
5. **Styling**: Use existing Tailwind classes and custom color palette
6. **State Management**: Use existing contexts or create new ones as needed