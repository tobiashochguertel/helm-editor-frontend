import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // https://github.com/vdesjs/vite-plugin-monaco-editor/issues/21
    monacoEditorPlugin.default({})
  ],
})
