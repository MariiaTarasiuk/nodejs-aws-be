import * as AWSLambda from "aws-lambda";
import * as AWSSDK from "aws-sdk";

export const importProductsFile = async (event: AWSLambda.APIGatewayEvent) => {
  const s3 = new AWSSDK.S3({ region: "eu-west-1", signatureVersion: "v4" });

  try {
    const { name } = event.queryStringParameters;
    const params = { Bucket: "app-import-storage", Key: `uploaded/${name}`, Expires: 60, ContentType: "text/csv" };

    const url = await s3.getSignedUrl("putObject", params);

    console.log("## SUCCESS IMPORT ##", url);
    return {
      statusCode: 202,
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true },
      body: url,
    };
  } catch (e) {
    console.log("## ERROR ##", e);
    return {
      statusCode: e.statusCode || 500,
      error: JSON.stringify(Error(e.message)),
      headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": true },
    };
  }
};
