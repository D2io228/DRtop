import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Client-only game: no server logic. Port 3000 matches the AI Studio preview.
export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0', port: 3000 },
  preview: { port: 3000 },
  build: { target: 'es2022', sourcemap: true },
});
