import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mix from 'vite-plugin-mix';
import { fileURLToPath } from 'url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let config = {
  // base: '/test.github.io/',
  plugins: [
    react(),
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
      '@/at-shared': path.resolve(__dirname, '..', '..', 'packages', 'shared', 'src', 'index.ts'),
      '@/components': path.resolve(__dirname, 'src', 'components'),
      '@/store': path.resolve(__dirname, 'src', 'store', 'index.ts'),
    },
  },
};


export default defineConfig(({ mode }) => {
  if(mode === 'development') {
    config = Object.assign(config, {
      plugins: [
        react(),
        mix({
          handler: './handler.ts',
        }),
      ],
    });
  }

  return config;
})
