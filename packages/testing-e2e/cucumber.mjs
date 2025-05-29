export default function () {
   const common = {
      format: [
         "progress-bar",
         "summary",
         "html:test-results/cucumber-report.html",
         "json:test-results/cucumber-report.json",
         "message:test-results/cucumber-messages.json",
         "junit:test-results/cucumber-junit.xml",
      ],
      formatOptions: {
         junit: {
            suiteName: "Cucumber Tests",
            uniqueTestNames: true,
         },
         html: {
            theme: "bootstrap",
            reportTitle: "E2E Test Report",
         },
      },
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
