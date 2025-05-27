import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { type DeployResult, type PackageInfo } from "./types/index.js";

/**
 * Cucumber test world.
 * https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md
 */
export class TestWorld extends World {
   examplePackages?: PackageInfo[];
   deployResults?: DeployResult[];

   constructor({ log, ...args }: IWorldOptions) {
      super({
         ...args,
         log: logger(log),
      });
   }
}

const logger = (log: IWorldOptions["log"]) => (message: string) => {
   console.log(message);
   log(message);
};

// Register the custom world
setWorldConstructor(TestWorld);
