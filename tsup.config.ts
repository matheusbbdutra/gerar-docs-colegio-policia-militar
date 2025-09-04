import { defineConfig } from "tsup";

export default defineConfig({
    entry: { main: "src/main.ts", preload: "src/preload.ts" },
    outDir: "dist",
    format: ["esm"],
    target: "node18",
    platform: "node",
    external: ["electron"],
    splitting: false,
    sourcemap: true,
    clean: true
});
