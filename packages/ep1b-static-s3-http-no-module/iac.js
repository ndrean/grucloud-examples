const assert = require("assert");
const path = require("path");
const { map } = require("rubico");
const mime = require("mime-types");
const { AwsProvider } = require("@grucloud/provider-aws");
const { getFiles } = require("./dumpster");

exports.createStack = async () => {
  const provider = AwsProvider({ config: require("./config") });
  const config = provider.config;
  const { websiteDir } = config;
  assert(websiteDir);

  const websiteBucket = await provider.makeS3Bucket({
    name: provider.config.bucketName,
    properties: () => ({
      ACL: "public-read",
      WebsiteConfiguration: {
        ErrorDocument: {
          Key: "error.html",
        },
        IndexDocument: {
          Suffix: "index.html",
        },
      },
    }),
  });

  const files = await getFiles(websiteDir);

  await map((file) =>
    provider.makeS3Object({
      name: file,
      dependencies: { bucket: websiteBucket },
      properties: () => ({
        ACL: "public-read",
        ContentType: mime.lookup(file) || "text/plain",
        source: path.join(websiteDir, file),
      }),
    })
  )(files);

  return {
    provider,
    resources: { websiteBucket },
    hooks: [require("./hooks")],
  };
};
