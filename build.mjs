import { build } from "esbuild";

build({
  entryPoints: ["src/index.tsx"],
  outdir: "dist",
  bundle: true,
  sourcemap: true,
  /* minify: true, */
  /* metafile: true, */
})
  /* .then(({ metafile }) => analyzeMetafile(metafile)) */
  .then(console.log)
  .catch(console.error);
