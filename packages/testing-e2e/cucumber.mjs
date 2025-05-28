export default function () {
   const common = {
      format: [
         "progress-bar",
         "html:test-results/cucumber-report.html",
         "json:test-results/cucumber-report.json",
         // "message:test-results/cucumber.ndjson",
         "junit:test-results/cucumber-results.xml",
      ],
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
