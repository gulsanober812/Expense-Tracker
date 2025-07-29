import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', {
            runtime: 'automatic'
          }]
        ]
      }
    }),
    tailwindcss()
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@headlessui/react',
      '@heroicons/react'
    ]
  },
  build: {
    chunkSizeWarningLimit: 1600,
  }
});