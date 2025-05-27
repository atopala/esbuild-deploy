import { Given } from "@cucumber/cucumber";
import { TestWorld } from "../test-world.js";
import path from "node:path";
import { glob } from "glob";
import type { PackageInfo } from "../types/index.js";
import { __DIRNAME__ } from "../config.js";
import fs from "node:fs";

Given("Loading example packages from workspace", async function (this: TestWorld) {
   // Get the workspace root directory (assuming we're in packages/testing-e2e)
   const workspaceRoot = path.resolve(__DIRNAME__, "../../..");

   // Find all example-* packages
   const examplePackages = await glob("packages/example-*", {
      cwd: workspaceRoot,
      absolute: true,
   });

   if (examplePackages.length === 0) {
      throw new Error("No example packages found in workspace");
   }

   // Store package information
   const packagesInfo: PackageInfo[] = [];

   for (const packagePath of examplePackages) {
      const packageJsonPath = path.join(packagePath, "package.json");

      if (!fs.existsSync(packageJsonPath)) {
         console.warn(`No package.json found in ${packagePath}`);
         continue;
      }

      try {
         const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

         packagesInfo.push({
            name: packageJson.name,
            type: packageJson.type, // 'module' for ESM, 'commonjs' or undefined for CJS
            main: packageJson.main, // Main entry point
            module: packageJson.module, // ESM entry point
            path: packagePath,
         });

         console.log(`Loaded package: ${packageJson.name} (${packageJson.type || "commonjs"})`);
      } catch (error) {
         console.error(`Error loading package.json from ${packagePath}:`, error);
         throw error;
      }
   }

   // Store the packages info in the TestWorld context for later use
   this.examplePackages = packagesInfo;
   console.log(`Successfully loaded ${packagesInfo.length} example packages`);
   this.attach(JSON.stringify(packagesInfo, null, 2), "application/json");
});
