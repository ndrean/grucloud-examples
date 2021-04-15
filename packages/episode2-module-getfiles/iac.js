const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleS3Http = require("../module-aws-s3-http");

exports.createStack = async () => {
  const provider = AwsProvider({ 
    configs:[
      require("./config"),
      ModuleS3Http.config
    ]
  });
  // const {config} = provider
  // assert(config.website)
 
  // const { website:{bucketName}} = config  
  // assert(bucketName)

  const s3HttpResources = await ModuleS3Http.createResources({ provider });
  assert(s3HttpResources)

  
  return {
    provider,
    resources: s3HttpResources,
    hooks: require("./hooks"),
  };
};
