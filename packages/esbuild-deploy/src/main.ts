import path from "node:path";
import fs from "node:fs/promises";

import deepmerge from "deepmerge";
import { build, type BuildOptions } from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import { getBuildOptionsList } from "./get-build-options-list.js";
import { buildPackageJson } from "./build-package-json.js";
import { x } from "./x.js";

function bundle(buildOptions?: BuildOptions) {
   const options = deepmerge(
      {
         tsconfig: path.resolve("./tsconfig.json"),
         plugins: [
            nodeExternalsPlugin({
               dependencies: false,
               peerDependencies: false,
               devDependencies: false,
               allowWorkspaces: true,
               packagePath: path.resolve("./package.json"),
            }),
         ],
      } satisfies BuildOptions,
      buildOptions ?? {},
   );
   console.log("Bundling", buildOptions);
   return build(options);
}

export async function main(args: { debug: boolean; outdir: string }) {
   const { debug, outdir } = args;
   const logLevel = x(() => {
      if (debug) {
         return "debug";
      } else {
         return "info";
      }
   });

   const { buildConfig, packageInfo } = await getBuildOptionsList({ logLevel, outdir });

   for (const buildOptions of buildConfig) {
      // console.debug("Bundle Setting", buildOptions);
      await bundle(buildOptions);
      // console.debug("Bundle Result", result);
   }

   const packageJson = buildPackageJson(packageInfo);
   await fs.writeFile(path.resolve(outdir, "package.json"), JSON.stringify(packageJson, null, " "));
}
