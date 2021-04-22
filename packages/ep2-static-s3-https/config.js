const path = require("path");
const pkg = require("./package.json");

module.exports = () => ({
  projectName: pkg.name,
  region: "us-east-1",
  website: {
    bucketName: "grucloud-examples.net",
    websiteDir: path.resolve(__dirname, "./frontend/ep3-react/build/"),
  },
  certificate: {
    rootDomainName: "grucloud-examples.net",
    domainName: "ep3.grucloud-examples.net",
  },
});
