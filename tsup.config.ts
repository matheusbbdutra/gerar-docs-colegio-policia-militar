import { defineConfig } from "tsup";

export default defineConfig({
    entry: { main: "src/main.ts", preload: "src/preload.ts" },
    outDir: "dist",
    format: ["cjs"],
    target: "node22",
    platform: "node",
    external: ["electron"],
    splitting: false,
    sourcemap: true,
    clean: true
});
