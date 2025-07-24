# Coding Style and Conventions

## TypeScript Configuration
- **Target**: ES5
- **Strict mode**: Enabled
- **Module system**: ESNext with Node resolution
- **JSX**: react-jsx transform

## Code Style Patterns
1. **TypeScript**: Strict typing enabled, comprehensive type definitions in `src/types/`
2. **Functional Components**: Uses React functional components with hooks
3. **Context Pattern**: State management via React Context (AuthContext, ThemeContext)
4. **Service Pattern**: Business logic abstracted into service classes/objects
5. **Lazy Loading**: Pages loaded via React.lazy() for performance

## Naming Conventions
- **Files**: PascalCase for components (e.g., `Dashboard.tsx`), camelCase for services (e.g., `auth.service.ts`)
- **Components**: PascalCase (e.g., `UserProfile`, `NewPostModal`)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEYS`, `WHATSAPP_TEMPLATES`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `AuthContextType`)

## Import Patterns
- Relative imports for local files
- Absolute imports from `src/` when needed
- Lazy imports for pages via `src/utils/lazyImports.ts`

## Component Structure
- Props interfaces defined inline or separately
- Destructured props
- Early returns for loading/error states
- Consistent JSX formatting with Tailwind classes