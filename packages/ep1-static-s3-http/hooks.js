const assert = require("assert");
const Axios = require("axios");

module.exports = ({ resources }) => {
  console.log("res", resources);
  const { websiteBucket } = resources;
  assert(websiteBucket.name);
  const bucketStorageUrl = `http://${websiteBucket.name}.s3-website-us-east-1.amazonaws.com`;

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
            console.log(result);
            assert.equal(result.headers["content-type"], `text/html`);
            assert.equal(result.status, 200);
          },
        },
      ],
    },
  };
};
