#!/usr/bin/env vite-node --script

import { program } from "commander";
import { main } from "./main.js";
import path from "node:path";

program
   .name("esbuild-deploy")
   .addHelpText("beforeAll", "Deploy your Node.js apps with esbuild - zero configuration, no node_modules needed.")
   .addHelpText("after", "Smart module detection from package.json (ESM/CJS).")
   .addHelpText("after", "Full documentation and examples: https://github.com/atopala/esbuild-deploy")
   .option("-h, --help", "display help for command", false)
   .option("-d, --debug", "output extra debugging from esbuild", false)
   .option("-o, --outdir <outdir>", "output directory. default is: ./deploy ", path.resolve("./deploy"))
   .parse();

const opts = program.opts<{ debug: boolean; help: boolean; outdir: string }>();
const { debug, help, outdir } = opts;

if (help) {
   program.help();
} else {
   await main({ debug, outdir });
}
