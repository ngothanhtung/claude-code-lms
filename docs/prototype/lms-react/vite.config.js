import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// LMS Portal — React + Vite
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true }
});
