import type { DeployResult, PackageInfo } from "../types/index.js";
import { execSync } from "node:child_process";

export async function executePackageBuild(pkg: PackageInfo): Promise<DeployResult> {
   // Store original working directory
   const originalCwd = process.cwd();

   try {
      // Change to package directory
      process.chdir(pkg.path);

      // Execute tsc --build
      const output = execSync("pnpm exec tsc --build", {
         stdio: "pipe",
         encoding: "utf-8",
      });

      return {
         packageName: pkg.name,
         output,
      };
   } catch (error) {
      console.error(error);
      throw new Error(`Error building ${pkg.name}: ${error instanceof Error ? error.message : String(error)}`);
   } finally {
      // Ensure we restore working directory even if build fails
      process.chdir(originalCwd);
   }
}
