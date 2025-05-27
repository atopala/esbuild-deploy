export interface PackageInfo {
   name: string;
   type?: "module" | "commonjs";
   main?: string;
   module?: string;
   path: string;
}
