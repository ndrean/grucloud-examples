const path = require("path");
const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  bucketName: "tutogrucloud2.com",
  websiteDir: path.resolve(__dirname, "./frontend/ep2-react/build/"),
});
