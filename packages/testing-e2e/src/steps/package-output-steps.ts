import { Then } from "@cucumber/cucumber";
import { TestWorld } from "../test-world.js";
import { ok } from "node:assert";
import path from "node:path";
import fs from "node:fs";

Then('Each example package should have a "deploy" directory', function (this: TestWorld) {
   ok(this.deployResults?.length, "testWorld.deployResults[] items are required");

   for (const result of this.deployResults) {
      const deployPath = path.join(result.deployPath!);
      if (!fs.existsSync(deployPath)) {
         throw new Error(`Deploy directory not found for ${result.packageName}`);
      }

      console.log(`Deploy directory found for ${result.packageName}: ${deployPath}`);
   }
});

Then("Each deploy directory should contain bundled files", function (this: TestWorld) {
   ok(this.deployResults?.length, "testWorld.deployResults[] items are required");

   for (const result of this.deployResults) {
      const deployPath = path.join(result.deployPath!);
      const files = fs.readdirSync(deployPath);
      if (files.length === 0) {
         throw new Error(`No bundled files found for ${result.packageName}`);
      }

      this.log(`Bundled files found for ${result.packageName}:\ndir:${deployPath}\n${files.join("\n")}`);
      this.attach(JSON.stringify(files, null, 2), { fileName: deployPath, mediaType: "application/json" });
   }
});

Then("Each bundled file should match its module type", function (this: TestWorld) {
   ok(this.examplePackages?.length, "testWorld.examplePackages[] items are required");
   ok(this.deployResults?.length, "testWorld.deployResults[] items are required");

   for (const pkg of this.examplePackages) {
      const result = this.deployResults.find((r) => r.packageName === pkg.name);
      ok(result, `No deploy result found for ${pkg.name}`);

      const deployPath = path.join(result.deployPath!);

      // Determine target entry point based on package type
      const isESM = pkg.type === "module";
      const entryPoint = isESM ? pkg.module : pkg.main;

      if (!entryPoint) {
         throw new Error(
            `Package ${pkg.name} is missing required entry point: ` +
               `expected '${isESM ? "module" : "main"}' in package.json`,
         );
      }

      const targetFile = path.basename(entryPoint);
      const targetFilePath = path.resolve(deployPath, entryPoint);
      const targetExists = fs.existsSync(targetFilePath);
      this.log(`Checking for ${pkg.name}: ${targetFilePath}.\ndeploy: ${deployPath}\nentryPoint: ${targetFile}`);

      if (!targetExists) {
         throw new Error(`Output not found for ${pkg.name}. ` + `Expected: ${targetFilePath}`);
      }

      this.log(`✓ ${pkg.name}: Found ${isESM ? "ESM" : "CJS"} output ${targetFilePath}`);
      this.attach(targetFilePath, { fileName: targetFile, mediaType: "application/json" });
   }
});
