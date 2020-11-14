import * as AWSLambda from "aws-lambda";

export const importProductsFile = async (event: AWSLambda.APIGatewayEvent) => {
  try {
    const name = event.queryStringParameters.name;
    return {
      statusCode: 200,
      body: JSON.stringify(name),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  } catch (e) {
    return {
      statusCode: 500,
      error: JSON.stringify(Error("bad file name")),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }
};
