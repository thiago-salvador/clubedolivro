# Suggested Commands

## Development Commands
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

## System Commands (macOS/Darwin)
```bash
# List files and directories
ls -la

# Find files
find . -name "*.tsx" -type f

# Search in files (using grep)
grep -r "search_term" src/

# Git operations
git status
git add .
git commit -m "message"
git push
```

## Project-Specific Notes
- Main working directory: `clube-do-livro/`
- Development server runs on `http://localhost:3000`
- No specific linting/formatting commands configured beyond Create React App defaults