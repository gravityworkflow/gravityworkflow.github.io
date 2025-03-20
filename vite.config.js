import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
    },
  },
  server: {
    port: 3000,
    open: true,
    strictPort: true,
  },
  resolve: {
    alias: {
      three: 'three',
    },
  },
  optimizeDeps: {
    include: ['three'],
  },
}));
