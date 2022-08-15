import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'node:path';

const sharedPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'packages', 'shared');

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/test.github.io/',
  plugins: [react()],
  /*
  optimizeDeps: {
    exclude: ['@react-three/fiber'],
  },
  */
  build: {
    // to make tests faster
    minify: false,
  },
  resolve: {
    alias: {
      '@/at-shared': path.resolve(sharedPath, 'src', 'index.ts'),
    },
  },
});
