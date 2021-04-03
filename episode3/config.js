const path = require("path");
const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  website: {
    bucketName: "tutogrucloud3.com",
    websiteDir: path.resolve(__dirname, "./frontend/ep3-react/build/"),
  },
  certificate: {
    rootDomainName: "thedownwinder.com",
    domainName: "test.thedownwinder.com",
  },
});
