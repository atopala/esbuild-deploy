import { BuildOptions } from "esbuild";
import { PackageInfo, PackageType, readPackageInfo } from "./read-package-info.js";
import { getBuildOptionsEsm } from "./get-build-options-esm.js";
import path from "node:path";
import { readPackageBuildOptions } from "./read-package-build-options.js";
import { x } from "./x.js";

export async function getBuildOptionsList(options: Required<Pick<BuildOptions, "outdir" | "logLevel">>): Promise<{
   buildConfig: BuildOptions[];
   packageInfo: PackageInfo;
}> {
   const deployConfigPath = path.resolve("./esbuild-deploy.json");
   const deployConfig = await readPackageBuildOptions(deployConfigPath);

   const packageJsonPath = path.resolve("./package.json");
   const packageInfo = await readPackageInfo(packageJsonPath);

   const buildOptions: BuildOptions = x(() => {
      switch (packageInfo.type) {
         case PackageType.ESM:
            return {
               entryPoints: [path.resolve(packageInfo.module)],
               outfile: path.resolve(options.outdir, packageInfo.module),
            };
         case PackageType.CJS:
            return {
               entryPoints: [path.resolve(packageInfo.main)],
               outfile: path.resolve(options.outdir, packageInfo.main),
            };
         case undefined:
         case null:
            throw new Error(`'type' in package.json is undefined: ${packageJsonPath}`);
      }
   });

   return {
      buildConfig: [
         ...getBuildOptionsEsm({
            ...buildOptions,
            outdir: undefined,
         }),
         ...deployConfig,
      ],
      packageInfo,
   };
}
