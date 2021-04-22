// const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleCloudFront = require("../module-aws-s3-https-cloudfront");

exports.createStack = async () => {
  const provider = AwsProvider({
    configs: [require("./config"), ModuleCloudFront.config],
  });

  const cloudFrontResources = await ModuleCloudFront.createResources({
    provider,
  });

  return {
    provider,
    resources: cloudFrontResources,

    hooks: require("./hooks"),
  };
};
