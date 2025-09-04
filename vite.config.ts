import { defineConfig } from "vite";
import tailwindcssPostcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
    root: "src/renderer",
    base: "",
    build: {
        outDir: "../../dist/renderer",
        emptyOutDir: true
    },
    server: { port: 5173, strictPort: true },
    css: {
        postcss: {
            plugins: [tailwindcssPostcss, autoprefixer],
        },
    },
});
