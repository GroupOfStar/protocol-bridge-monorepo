import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    emptyOutDir: true,
    outDir: './../DemoHarmonyApp/entry/src/main/resources/resfile/dist/',
  },
  plugins: [react()],
  server: {
    port: 6173,
  },
});
