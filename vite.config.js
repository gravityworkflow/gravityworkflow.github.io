import { defineConfig } from 'vite';

export default defineConfig({
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
    historyApiFallback: true,
  },
  optimizeDeps: {
    include: ['three'],
  },
});
