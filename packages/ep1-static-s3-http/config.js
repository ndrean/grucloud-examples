const path = require("path");
const pkg = require("./package.json");

module.exports = () => ({
  projectName: pkg.name,
  region: "us-east-1",
  website: {
    bucketName: "tutogrucloud2-module.com",
    websiteDir: path.resolve(__dirname, "./frontend/ep2-react/build/"),
  },
});
