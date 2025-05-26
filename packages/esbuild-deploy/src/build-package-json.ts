import { PackageInfo } from "./read-package-info.js";

export function buildPackageJson(packageInfo: PackageInfo): Record<string, unknown> {
   const result: Record<string, unknown> = {};
   for (const [key, value] of Object.entries(packageInfo)) {
      if (key.toLocaleLowerCase().includes("dependencies")) {
         continue;
      }

      if (key === "scripts") {
         result[key] = {
            start: `node ${packageInfo.type === "module" ? packageInfo.module : packageInfo.main}`,
         };
         continue;
      }

      result[key] = value;
   }

   return result;
}
