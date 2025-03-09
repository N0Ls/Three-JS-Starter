import glsl from "vite-plugin-glsl";
import topLevelAwait from "vite-plugin-top-level-await";

export default {
    root: "src/",
    publicDir: "../static/",
    base: "./",
    server:
    {
        host: true,
        open: true,
        port: 3000,
        https: false,
        strictPort: true,
    },
    build:
    {
        outDir: "../dist",
        emptyOutDir: true,
        sourcemap: true,
    },
};