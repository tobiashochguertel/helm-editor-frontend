import dotenv from 'dotenv';
dotenv.config();

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

const {
  BACKEND_PORT = 3001,
  BACKEND_HOSTNAME = 'localhost',
  BACKEND_TEMPLATE_HOSTNAME = 'localhost',
  BACKEND_TEMPLATE_PORT = 3002,
} = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // https://github.com/vdesjs/vite-plugin-monaco-editor/issues/21
    monacoEditorPlugin.default({}),
  ],
  server: {
    proxy: {
      // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: `http://${BACKEND_HOSTNAME}:${BACKEND_PORT}/`,
        changeOrigin: false,
        autoRewrite: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/template': {
        target: `http://${BACKEND_TEMPLATE_HOSTNAME}:${BACKEND_TEMPLATE_PORT}/`,
        changeOrigin: false,
        autoRewrite: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  },
})
