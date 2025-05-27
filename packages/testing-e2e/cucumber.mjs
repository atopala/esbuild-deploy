export default function () {
   const common = {
      format: ["progress-bar", "html:test-results/cucumber-report.html", "json:test-results/cucumber-report.json"],
      paths: ["./features/*.feature"],
      loader: ["ts-node/esm"],
      import: ["./src/**/*.ts"],
   };

   return {
      devops: {
         parallel: 10,
         ...common,
         worldParameters: {
            config: {},
         },
      },
      default: {
         ...common,
         worldParameters: {
            config: {},
         },
      },
   };
}
