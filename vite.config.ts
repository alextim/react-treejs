import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/test.github.io/',
  plugins: [react()],
  build: {
    // to make tests faster
    minify: false,
  },   
});
