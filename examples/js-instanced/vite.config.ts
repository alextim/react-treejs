import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'node:path';

const sharedPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'packages', 'shared');

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    // to make tests faster
    minify: false,
  },
  resolve: {
    alias: {
      '@/at-shared/data/blocks.json': path.resolve(sharedPath, 'dist', 'blocks.json'),
      '@/at-shared/data/palettes.json': path.resolve(sharedPath, 'dist', 'palettes.json'),
      '@/at-shared': path.resolve(sharedPath, 'src', 'index.ts'),
    },
  },
});
