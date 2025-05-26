# esbuild-deploy

A zero-config deployment bundler that leverages esbuild to create optimized distribution packages for Node.js applications.

## Overview

`esbuild-deploy` simplifies the deployment process by creating optimized bundles of your Node.js applications, eliminating the need to deploy the entire `node_modules` directory.

It automatically configures `esbuild` based on your `package.json` settings.

## Features

- ✨ Zero-configuration required
- 🚀 Automatic detection of ESM/CJS from package.json
- 📦 Creates minimal deployment bundles
- ⚡ Powered by esbuild for maximum performance
- 🎯 Respects your package.json `main` and `module` fields

## Installation

```bash
npm install --save-dev esbuild-deploy
# or
yarn add -D esbuild-deploy
# or
pnpm add -D esbuild-deploy
```
## Package Configuration

### ESM Packages
For ESM (ECMAScript Modules) packages, your `package.json` should include:

```json
{
  "type": "module",        // Declares this as an ESM package
  "module": "src/index.js" // Entry point for ESM builds
}
```

### CommonJS Packages
For CommonJS packages, your `package.json` should include:

```json
{
  "main": "src/index.js"   // Entry point for CJS builds
  // Note: Omitting "type": "module" defaults to CommonJS
}
```

### Dual ESM/CommonJS Packages
For packages that support both module systems `type` will be used for bundling `esm` vs. `cjs`:

```json
{
  "type": "module",
  "main": "src/index.cjs",  // Entry point for CJS builds
  "module": "src/index.js"   // Entry point for ESM builds
}
```

## Usage
### 1. Command Line

```bash
npx esbuild-deploy
```

### 2. Package Scripts
Add to your `package.json`:

```json
{
  "scripts": {
    "build": "esbuild-deploy"
  }
}

```

## How It Works
`esbuild-deploy` reads your `package.json` configuration and automatically:
- Determines the module type (ESM/CJS) from the type field: `commonjs` vs. `module`
- Identifies entry points from `main` (CJS) or `module` (ESM) fields
- Generates an optimal `esbuild` configuration
- Creates a deployment-ready bundle in the `deploy/` directory

For ESM builds, it automatically injects a compatibility layer that enables seamless usage of CommonJS dependencies.
This means you can use both ESM and CJS dependencies in your ESM projects without worrying about compatibility issues.

Example of injected compatibility code:
```javascript
import { createRequire } from 'module';
import url from 'node:url'; 
const require = createRequire(import.meta.url);
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
```

This injection ensures that CommonJS-specific variables ( `require`, `__filename`, `__dirname`) are available in your ESM bundle, making it compatible with dependencies that expect a CommonJS environment.

## TypeScript Support
While `esbuild` can handle TypeScript files, it doesn't perform type checking.

For TypeScript projects, the recommended workflow is:
- Use the TypeScript compiler ( tsc) to:
* Perform type checking
* Generate JavaScript output
- Use `esbuild-deploy` to bundle the TypeScript compiler's output

Example TypeScript project setup:

`package.json`
```json
{
  "name": "example-typescript-package",
  "type": "module",
  "module": "dist/index.js",
  "scripts": {
    "build": "tsc && esbuild-deploy",
    "typecheck": "tsc --noEmit"
  }
}
```
The `build` script here will run TypeScript compiler and then `esbuild-deploy` to create the deployment release.

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "node"
  },
  "include": ["src/**/*"]
}
```

Project structure:
```text
typescript-project/
├── src/
│   └── index.ts
├── dist/           # TypeScript compiler output
│   └── index.js
├── deploy/         # esbuild-deploy bundle
│   └── index.js
├── package.json
└── tsconfig.json
```

## Example Project Structure
```text
your-project/
├── src/
│   └── index.js
├── package.json
└── deploy/          # Generated deployment bundle
    └── index.js     # Optimized bundle
```

## Real-World Example
Using the included example-fastify-esm package:

`package.json`
```json
{
  "name": "example-fastify-esm",
  "type": "module",
  "module": "src/index.js",
  "scripts": {
    "deploy": "esbuild-deploy"
  }
}
```

After running pnpm build, the deploy/ directory will contain a single optimized bundle ready for deployment.

## Configuration
`esbuild-deploy` is designed to be zero-config, but respects the following package.json fields:
- type: Determines the module system (ESM or CJS)
- main: Entry point for CommonJS builds
- module: Entry point for ESM builds

### Extended Build Configuration

While `esbuild-deploy` aims to be zero-config, you can extend the `esbuild` configuration by creating an `esbuild-deploy.json` file in your package root.
This file should contain an array of `esbuild` build options that will be executed alongside the main bundle.

Example `esbuild-deploy.json`:
```json
[
  {
    "entryPoints": [
      "./node_modules/better-sqlite3/build/Release/better_sqlite3.node"
    ],
    "outdir": "./deploy/Release/",
    "loader": {
      ".node": "copy"
    }
  }
]
```

This configuration is particularly useful for:

Including native modules (.node files)

Copying additional assets

Creating multiple bundles with different configurations

Customizing the build process for specific files

Each object in the array represents a separate esbuild build configuration and supports all standard esbuild options.
These builds will be executed in addition to the main application bundle.

#### Real-World Example: Native Modules
The included example-fastify-esm package demonstrates how to handle native modules like better-sqlite3:
```text
example-fastify-esm/
├── src/
│   └── index.js
├── package.json
├── esbuild-deploy.json    # Additional build configuration
└── deploy/
    ├── index.js          # Main bundle
    └── Release/          # Native module files
        └── better_sqlite3.node
```
The `esbuild-deploy.json` ensures that the native `.node` file is properly copied to the deployment directory, maintaining the expected directory structure for the SQLite module to work correctly.

## Benefits
- Smaller Deployments : Only ship what you need
- Faster Deployments : No need to transfer node_modules
- Simplified Dependencies : Single-file bundle includes all dependencies
- Optimized Output : Leverages esbuild's powerful optimization features

## Requirements
- Node.js 18.x or higher
- `package.json` with valid configuration

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

License
MIT