const assert = require("assert");
const Axios = require("axios");
const ModuleCloudFront = require("../module-aws-s3-https-cloudfront")

module.exports = ({ resources }) => {
  const { s3HttpResources } = resources;
  assert(s3HttpResources)
  assert(s3HttpResources.websiteBucket.name)
  const bucketStorageUrl = `http://${s3HttpResources.websiteBucket.name}.s3-website-us-east-1.amazonaws.com`;
  
  const axios = Axios.create({
    timeout: 15e3,
    withCredentials: true,
  });

  return {
    onDeployed: {
      actions: [
        {
          name: `get ${bucketStorageUrl}`,
          command: async () => {
            const result = await axios.get(bucketStorageUrl);
            assert.equal(result.headers["content-type"], `text/html`);
            assert.equal(result.status, 200);
          },
        },
      ],
    },
  };
};
