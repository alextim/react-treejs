import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import react from '@vitejs/plugin-react';
import mockServer from 'vite-plugin-simple-json-server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // base: '/test.github.io/',
  plugins: [
    react(),
    mockServer(),
  ],
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
      '@/at-shared': path.resolve(__dirname, 'src','shared', 'index.ts'),
      '@/components': path.resolve(__dirname, 'src', 'components'),
      '@/store': path.resolve(__dirname, 'src', 'store', 'index.ts'),
    },
  },

});
