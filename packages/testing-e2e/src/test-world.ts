import { IWorld } from "@cucumber/cucumber";
import { DeployResult, PackageInfo } from "./types/index.js";

/**
 * Cucumber test world.
 * https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md
 */
export interface TestWorld extends IWorld {
   examplePackages?: PackageInfo[];
   deployResults?: DeployResult[];
}
