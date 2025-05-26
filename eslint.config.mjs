import js from "@eslint/js";
import { config, configs } from "typescript-eslint";

export default config(
   {
      ignores: ["dist", "**/codegen/**", "deploy"],
   },
   {
      settings: {
         "import/resolver": {
            typescript: {
               project: "packages/*/tsconfig.json",
            },
         },
      },
      extends: [js.configs.recommended, ...configs.recommended],
      files: ["**/*.{ts,tsx}"],
      languageOptions: {
         ecmaVersion: 2020,
      },
      plugins: {},
      rules: {},
   },
);

//
//
// export default {
//     root: true,
//     parser: "@typescript-eslint/parser",
//     plugins: ["@typescript-eslint", "simple-import-sort", "jest"],
//     extends: [
//         "eslint:recommended",
//         "plugin:@typescript-eslint/eslint-recommended",
//         "plugin:@typescript-eslint/recommended",
//         "plugin:prettier/recommended",
//         "plugin:jest/recommended",
//     ],
//     rules: {
//         semi: "error",
//         "@typescript-eslint/no-explicit-any": "error",
//         "no-duplicate-imports": "error",
//         "simple-import-sort/imports": "error",
//         "simple-import-sort/exports": "error",
//         "sort-imports": "off",
//         "import/order": "off",
//         "nonblock-statement-body-position": "error",
//         "no-console": "warn",
//     }
// };
