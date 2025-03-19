import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/gravityworkflow.github.io/' : '/',
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
  build: {
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
}));
