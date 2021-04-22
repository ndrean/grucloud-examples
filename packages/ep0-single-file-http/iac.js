const path = require("path");
const { AwsProvider } = require("@grucloud/provider-aws");

exports.createStack = async () => {
  const provider = AwsProvider({ config: require("./config") });
  const s3Bucket = await provider.makeS3Bucket({
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

  const s3Object = await provider.makeS3Object({
    name: "index.html",
    dependencies: { bucket: s3Bucket },
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/html",
      source: path.join(process.cwd(), "index.html"),
    }),
  });

  return { provider, resources: { s3Bucket }, hooks: require("./hooks") };
};
