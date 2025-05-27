import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import path from "node:path";
import type { BuildOptions } from "esbuild";
import deepmerge from "deepmerge";

export function getBuildOptionsEsm(options: Partial<BuildOptions>): BuildOptions[] {
   const __filename = fileURLToPath(import.meta.url);
   globalThis.require = createRequire(__filename);
   // const __dirname = path.dirname(__filename);

   // console.dir({
   //    __dirname,
   //    __filename,
   //    cwd: process.cwd(),
   //    "./": path.resolve("./"),
   // });

   return [
      deepmerge(
         {
            allowOverwrite: true,
            format: "esm",
            sourcemap: true,
            platform: "node",
            target: "node20",
            bundle: true,
            minify: false,
            keepNames: true,
            tsconfig: path.resolve("./tsconfig.json"),
            logLevel: "info",
            banner: {
               js: `
/**
 injected by esbuild-deploy for backwards compatibility with cjs dependencies
**/

import { createRequire as topLevelCreateRequire } from 'module';
import url from 'node:url'; 
const require = topLevelCreateRequire(import.meta.url);
const _filename_ = url.fileURLToPath(import.meta.url);
const _dirname_ = url.fileURLToPath(new URL('.', import.meta.url));

/**
   output from esbuild
**/

            `,
            },
            define: {
               __filename: "_filename_",
               __dirname: "_dirname_",
               "process.env.NODE_ENV": "'production'",
            },
         } satisfies BuildOptions,
         options,
      ),
   ];
}
