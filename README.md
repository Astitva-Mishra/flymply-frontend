# Flymply Frontend

This is the frontend application for Flymply.

## Project Structure

This project is built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Getting Started

To get started with development:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Features

### Local Caching

The frontend includes local caching functionality for prediction responses:

- **Automatic Caching**: All prediction responses from the backend are automatically cached in localStorage
- **Cache Fallback**: If the backend is unavailable, the frontend will use cached responses for similar input windows
- **Cache Management**: 
  - Cache entries expire after 24 hours
  - Maximum of 100 cached entries (oldest entries are removed automatically)
  - Cache is keyed by window data hash for efficient lookup

### Dummy Data Generation

Similar to the backend `test_predict.py`, the frontend includes `generateDummyWindow()` function that can generate test data:

```typescript
import { generateDummyWindow } from '@/lib/api';

// Generate turbulent window data
const turbulentWindow = generateDummyWindow('turbulent');

// Generate calm window data
const calmWindow = generateDummyWindow('calm');
```

This is useful for testing and development when the backend is not available.