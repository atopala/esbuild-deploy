import { When } from "@cucumber/cucumber";
import { TestWorld } from "../test-world.js";
import { ok } from "node:assert";
import { executePackageDeploy } from "../lib/index.js";

When('For each example package execute "esbuild-deploy" with default config', async function (this: TestWorld) {
   ok(this.examplePackages?.length, "testWorld.examplePackages[] items are required");

   console.log(`Found ${this.examplePackages.length} packages to deploy`);

   const results = [];
   for (const pkg of this.examplePackages) {
      console.log(`Deploying package: ${pkg.name}`);
      const result = await executePackageDeploy(pkg);
      results.push(result);
      console.log(`Deployed package: ${pkg.name}`);
      console.log(`Deployed to: ${result.deployPath}`);
      console.log(`Deployed output:\n${result.output}`);
   }

   this.deployResults = results;
   this.attach(JSON.stringify(results, null, 2), "application/json");
});
