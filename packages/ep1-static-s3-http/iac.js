const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleS3Http = require("../module-aws-s3-http");
const hook = require("./hook");

exports.createStack = async () => {
  const provider = AwsProvider({
    configs: [require("./config"), ModuleS3Http.config],
  });

  const s3HttpResources = await ModuleS3Http.createResources({ provider });
  assert(s3HttpResources);

  return {
    provider,
    resources: s3HttpResources,
    hooks: [hook],
  };
};
