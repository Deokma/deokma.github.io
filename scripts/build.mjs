/* build.mjs — bundles src/main.jsx into assets/app.js (React included, minified).
   The output is committed so GitHub Pages can serve the repo as-is.
     npm run build          one-off production build
     npm run dev            rebuild on change + serve on http://localhost:8000 (in memory;
                            run `npm run build` before committing) */
import * as esbuild from "esbuild";

const options = {
  entryPoints: ["src/main.jsx"],
  outfile: "assets/app.js",
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "iife",
  target: ["es2020", "chrome90", "firefox90", "safari15"],
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "eof",
  logLevel: "info",
};

if (process.argv.includes("--serve")) {
  const ctx = await esbuild.context({ ...options, minify: false, sourcemap: "inline", write: false });
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: ".", port: 8000 });
  console.log(`serving on http://localhost:${port}`);
} else {
  await esbuild.build(options);
}
