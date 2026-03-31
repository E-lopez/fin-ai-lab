/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
  },
  server: {
    watch: {
			usePolling: true,
		},
    host: true,
  },
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      instances: [
        { browser: 'chromium', headless: true },
        { browser: 'firefox', headless: true },
        { browser: 'webkit', headless: true },
      ]
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/src/main.tsx',
        '**/src/vite.config.ts',
        '**/src/setupTests.ts',
      ],
    },
  },
})
