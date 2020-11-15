import * as AWSLambda from "aws-lambda";
import * as AWSSDK from "aws-sdk";

export const importProductsFile = async (event: AWSLambda.APIGatewayEvent) => {
  const s3 = new AWSSDK.S3({ region: "eu-west-1", signatureVersion: "v4" });
  try {
    const { name } = event.queryStringParameters;
    const params = { Bucket: "app-import-storage", Key: `uploaded/${name}`, Expires: 60, ContentType: "text/csv" };

    return new Promise((res, rej) => {
      s3.getSignedUrl("putObject", params, (err, url) => {
        if (err) return rej(err);
        res({
          statusCode: 202,
          headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true },
          body: url,
        });
      });
    });
  } catch (e) {
    console.log("## ERROR ##", e);
    return {
      statusCode: 500,
      error: JSON.stringify(Error(e.message)),
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true },
    };
  }
};
