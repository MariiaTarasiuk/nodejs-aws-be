import * as AWSLambda from "aws-lambda";

export function getProductList(event: AWSLambda.APIGatewayEvent, _context: AWSLambda.Context) {
  return {
    statusCode: 200,
    body: `mock product list`,
  };
}
