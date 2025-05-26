import type { BuildOptions } from "esbuild";
import fs from "node:fs/promises";
import { ok } from "node:assert";

export async function readPackageBuildOptions(filePath: string): Promise<BuildOptions[]> {
   ok(filePath, "filePath is required");

   try {
      await fs.access(filePath);
   } catch (error) {
      console.warn(`Esbuild config file ${filePath} does not exist. Err: ${error}`);
      return [];
   }

   const config = JSON.parse(await fs.readFile(filePath, "utf-8"));
   ok(Array.isArray(config), "bundler.json must be an array");
   return config;
}
