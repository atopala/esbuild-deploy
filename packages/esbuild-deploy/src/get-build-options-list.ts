import { BuildOptions } from "esbuild";
import { PackageInfo, PackageType, readPackageInfo } from "./read-package-info.js";
import { getBuildOptionsEsm } from "./get-build-options-esm.js";
import { getBuildOptionsCjs } from "./get-build-options-cjs.js";
import path from "node:path";
import { readPackageBuildOptions } from "./read-package-build-options.js";
import { DEPLOY_DIR_NAME } from "./config.js";

export async function getBuildOptionsList(
   options: Partial<BuildOptions>,
): Promise<{ buildConfig: BuildOptions[]; packageInfo: PackageInfo }> {
   const deployConfigPath = path.resolve("./esbuild-deploy.json");
   const deployConfig = await readPackageBuildOptions(deployConfigPath);

   const packageJsonPath = path.resolve("./package.json");
   const packageInfo = await readPackageInfo(packageJsonPath);

   switch (packageInfo.type) {
      case PackageType.ESM:
         return {
            buildConfig: [
               ...getBuildOptionsEsm({
                  outdir: path.resolve(DEPLOY_DIR_NAME, path.dirname(packageInfo.module)),
                  entryPoints: [path.resolve(packageInfo.module)],
                  ...options,
               }),
               ...deployConfig,
            ],
            packageInfo,
         };
      case PackageType.CJS:
         return {
            buildConfig: [
               ...getBuildOptionsCjs({
                  outdir: path.resolve(DEPLOY_DIR_NAME, path.dirname(packageInfo.main)),
                  entryPoints: [path.resolve(packageInfo.main)],
                  ...options,
               }),
               ...deployConfig,
            ],
            packageInfo,
         };
      case undefined:
      case null:
         throw new Error(`'type' in package.json is undefined: ${packageJsonPath}`);
   }
}
