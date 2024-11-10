import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Default behavior is to run react compiler on the entire codebase
const ReactCompilerConfig = {};

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        server: {
            // This will automatically redirect API calls for us
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    secure: false
                }
            },
        },
        build: {
            target: "esnext",
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
