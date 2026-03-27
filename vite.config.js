import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env': JSON.stringify({}),
  },
  build: {
    lib: {
      entry: 'src/main.jsx',
      formats: ['iife'],
      name: 'LuscherTest',
      fileName: () => 'luscher-test.js',
    },
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
