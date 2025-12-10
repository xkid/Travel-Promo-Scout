import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    // Base path './' ensures assets work in subdirectories (like https://user.github.io/repo/)
    // AND at the root (like https://app.vercel.app/)
    base: '/Travel-Promo-Scout/',
    define: {
      // safely expose the API_KEY to the client-side code during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Polyfill process.env to prevent "process is not defined" crashes
      'process.env': {}
    },
    build: {
      outDir: 'dist',
    }
  };
});