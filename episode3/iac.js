const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleCertificate = require("@grucloud/module-aws-certificate");
const ModuleS3Http = require("../module-aws-s3-http");

/*
exports.config = require("./config");
exports.hooks = require("./hooks");
*/

exports.createStack = async () => {
  const provider = AwsProvider({
    configs: [
      require("./config"),
      ModuleS3Http.config,
      ModuleCertificate.config,
    ],
  });

  const s3HttpResources = await ModuleS3Http.createResources({ provider });
  const certificatesResources = await ModuleCertificate.createResources({
    provider,
  });

  return {
    provider,
    resources: { s3HttpResources, certificatesResources },
    hooks: require("./hooks"),
  };
};
