const assert = require("assert");
const path = require("path");
const { map } = require("rubico");
const mime = require("mime-types");
const { getFiles } = require("./dumpster");

exports.config = require("./config");
exports.hooks = require("./hooks");

const createResources = async ({ provider }) => {
  const config = provider.config;
  const { websiteDir, bucketName } = config.website;
  assert(websiteDir);
  assert(bucketName);

  const websiteBucket = await provider.makeS3Bucket({
    name: bucketName,
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

  const s3Objects = await map((file) =>
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

  return { websiteBucket, s3Objects };
};

exports.createResources = createResources;
