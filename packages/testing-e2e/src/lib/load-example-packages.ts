import path from "node:path";
import { __DIRNAME__ } from "../config.js";
import { PackageInfo } from "../types/index.js";
import fs from "node:fs/promises";
import { glob } from "glob";
import assert from "node:assert";

export async function loadExamplePackages() {
   // Get the workspace root directory (assuming we're in packages/testing-e2e)
   const rootPath = path.resolve(__DIRNAME__, "../../../");

   // Find all example-* packages
   const examplePackageJsonList = await glob("packages/example-*/package.json", {
      cwd: rootPath,
      absolute: true,
      ignore: ["**/node_modules/**"],
   });

   assert.ok(examplePackageJsonList.length > 0, `No packages found in root: ${rootPath}`);

   // Store package information
   const packageInfoList: PackageInfo[] = [];

   // Load package.json for each example package
   for (const packageJsonPath of examplePackageJsonList) {
      await fs.access(packageJsonPath);
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));

      packageInfoList.push({
         name: packageJson.name,
         type: packageJson.type, // 'module' for ESM, 'commonjs' or undefined for CJS
         main: packageJson.main, // Main entry point
         module: packageJson.module, // ESM entry point
         path: packageJsonPath,
      });
   }

   return packageInfoList;
}
