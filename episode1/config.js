const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  bucketName: "tutogrucloud1.com",
});
