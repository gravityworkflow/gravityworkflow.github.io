import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    // base: env.VITE_BASE_URL,
    base: '/gravityworkflow.github.io',
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
  };
});
