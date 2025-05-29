import { When } from "@cucumber/cucumber";
import { ok } from "node:assert";
import { executePackageBuild } from "../lib/index.js";

When(/^For each example package execute "tsc --build" with default config$/, async function () {
   ok(this.examplePackages?.length, "testWorld.examplePackages[] items are required");

   console.log(`Found ${this.examplePackages.length} packages to deploy`);

   const results = [];
   for (const pkg of this.examplePackages) {
      console.log(`Building package: ${pkg.name}`);
      const result = await executePackageBuild(pkg);
      results.push(result);

      console.log(`Build package: ${pkg.name}`);
      console.log(`Build to: ${result.deployPath}`);
      console.log(`Build output:\n${result.output}`);
   }

   this.deployResults = results;
   this.attach(JSON.stringify(results, null, 2), "application/json");
});
