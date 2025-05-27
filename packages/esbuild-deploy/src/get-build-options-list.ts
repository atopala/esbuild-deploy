import { BuildOptions } from "esbuild";
import { PackageInfo, PackageType, readPackageInfo } from "./read-package-info.js";
import { getBuildOptionsEsm } from "./get-build-options-esm.js";
import path from "node:path";
import { readPackageBuildConfig } from "./read-package-build-config.js";
import { x } from "./x.js";
import { getBuildOptionsCjs } from "./get-build-options-cjs.js";

export async function getBuildOptionsList(options: Required<Pick<BuildOptions, "outdir" | "logLevel">>): Promise<{
   buildConfig: BuildOptions[];
   packageInfo: PackageInfo;
}> {
   const packageConfigPath = path.resolve("./esbuild-deploy.json");
   const packageConfig = await readPackageBuildConfig(packageConfigPath);

   const packageJsonPath = path.resolve("./package.json");
   const packageInfo = await readPackageInfo(packageJsonPath);

   const buildConfig: BuildOptions[] = x(() => {
      switch (packageInfo.type) {
         case PackageType.ESM:
            return [
               ...getBuildOptionsEsm({
                  entryPoints: [path.resolve(packageInfo.module)],
                  outfile: path.resolve(options.outdir, packageInfo.module),
                  outdir: undefined,
               }),
               ...packageConfig,
            ];
         case PackageType.CJS:
            return [
               ...getBuildOptionsCjs({
                  entryPoints: [path.resolve(packageInfo.main)],
                  outfile: path.resolve(options.outdir, packageInfo.main),
                  outdir: undefined,
               }),
               ...packageConfig,
            ];
         case undefined:
         case null:
            throw new Error(`'type' in package.json is undefined: ${packageJsonPath}`);
      }
   });

   return {
      buildConfig,
      packageInfo,
   };
}
