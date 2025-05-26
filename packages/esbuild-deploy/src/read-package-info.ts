import { ok } from "node:assert";
import fs from "node:fs/promises";
import { Static, Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export async function readPackageInfo(dir: string): Promise<PackageInfo> {
   ok(dir, "dir is required");

   try {
      await fs.access(dir);
   } catch (error) {
      console.error(`package.json file not found in ${dir}. Err: ${error}`);
      throw new PathNotFoundError(`package.json file not found in ${dir}`, error);
   }

   const pkg = JSON.parse(await fs.readFile(dir, "utf-8"));
   return PackageInfoValidator.Decode(pkg);
}

export class PathNotFoundError extends Error {
   constructor(
      message: string,
      public readonly innerError: unknown,
   ) {
      super(message);
      this.name = "PathNotFoundError";
   }
}

export enum PackageType {
   ESM = "module",
   CJS = "commonjs",
}

const PackageInfo = Type.Intersect([
   Type.Union([
      Type.Object({
         type: Type.Literal(PackageType.ESM),
         module: Type.String({ minLength: 1 }),
      }),
      Type.Object({
         type: Type.Literal(PackageType.CJS),
         main: Type.String({ minLength: 1 }),
      }),
   ]),
   Type.Object({
      scripts: Type.Optional(Type.Record(Type.String(), Type.String())),
      dependencies: Type.Optional(Type.Record(Type.String(), Type.String())),
      devDependencies: Type.Optional(Type.Record(Type.String(), Type.String())),
      peerDependencies: Type.Optional(Type.Record(Type.String(), Type.String())),
   }),
]);
export type PackageInfo = Static<typeof PackageInfo>;
const PackageInfoValidator = TypeCompiler.Compile(PackageInfo);
