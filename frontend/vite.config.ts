import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Default behavior is to run react compiler on the entire codebase
const ReactCompilerConfig = {};

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    build: {
      target: 'esnext'
    },
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
  };
});