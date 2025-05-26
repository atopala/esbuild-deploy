import path from "node:path";
import type { BuildOptions } from "esbuild";
import deepmerge from "deepmerge";

export function getBuildOptionsCjs(options: Partial<BuildOptions>): BuildOptions[] {
   return [
      deepmerge(
         {
            format: "cjs",
            sourcemap: true,
            define: {
               "process.env.NODE_ENV": "'production'",
            },
            bundle: true,
            minify: false,
            keepNames: true,
            platform: "node",
            target: "node20",
            logLevel: "info",
            tsconfig: path.resolve("./tsconfig.json"),
         },
         options,
      ),
   ];
}
