import { build, analyzeMetafile } from "esbuild";

build({
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  bundle: true,
  sourcemap: true,
  minify: true,
  metafile: true,
})
  .then(({ metafile }) => analyzeMetafile(metafile))
  .then(console.log)
  .catch(console.error);
