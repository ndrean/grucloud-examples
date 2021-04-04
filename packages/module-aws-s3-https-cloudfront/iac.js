const assert = require("assert");
const { makeDomainName } = require("./dumpster");
// const { AwsProvider } = require("@grucloud/provider-aws");
const ModuleCertificate = require("@grucloud/module-aws-certificate");
const ModuleS3Http = require("../module-aws-s3-http");

// exports.config = require("./config");
// exports.hooks = require("./hooks");

const createResources = async ({provider}) => {
  
  const s3HttpResources = await ModuleS3Http.createResources({ provider });
  assert(s3HttpResources)
  const certificatesResources = await ModuleCertificate.createResources({
    provider,
  });
  assert(certificatesResources.certificate)
  
  const {config} = provider
  assert(config.website)
 
  const { website:{bucketName}, certificate:{domainName,rootDomainName }, stage} = config  
  assert(bucketName)
  assert(domainName)
  
  
  const distribution = await provider.makeCloudFrontDistribution({
    name: `distribution-${bucketName}`,
    dependencies: { website: s3HttpResources.websiteBucket, certificate: certificatesResources.certificate},
    properties: ({}) => {
      return {
        PriceClass: "PriceClass_100",
        Comment: `${bucketName}.s3.amazonaws.com`,
        Aliases: { Quantity: 1, Items: [domainName] },
        DefaultRootObject: "index.html",
        DefaultCacheBehavior: {
          TargetOriginId: `S3-${bucketName}`,
          ViewerProtocolPolicy: "redirect-to-https",
          ForwardedValues: {
            Cookies: {
              Forward: "none",
            },
            QueryString: false,
          },
          MinTTL: 600,
          TrustedSigners: {
            Enabled: false,
            Quantity: 0,
            Items: [],
          },
        },
        Origins: {
          Items: [
            {
              DomainName: `${bucketName}.s3.amazonaws.com`,
              Id: `S3-${bucketName}`,
              S3OriginConfig: { OriginAccessIdentity: "" },
            },
          ],
          Quantity: 1,
        },
      };
    },
  });

  const hostedZoneName = `${makeDomainName({
    DomainName: domainName,
    stage,
  })}.`;

  const domain = await provider.useRoute53Domain({
    name: rootDomainName,
  });

  const hostedZone = await provider.makeHostedZone({
    name: `${domainName}.`,
    dependencies: { domain },
  });

  const recordCloudFront = await provider.makeRoute53Record({
    name: hostedZoneName,
    dependencies: { hostedZone, distribution },
    //TODO this code should be handled by Route53Record
    properties: ({ dependencies: { distribution } }) => {
      return {
        Name: hostedZoneName,
        Type: "A",
        AliasTarget: {
          HostedZoneId: "Z2FDTNDATAQYW2",
          DNSName: `${distribution?.live?.DomainName}.`,
          EvaluateTargetHealth: false,
        },
      };
    },
  });

  return {
     s3HttpResources, certificatesResources, recordCloudFront,
      distribution, hostedZone,
  };
};

exports.createResources = createResources