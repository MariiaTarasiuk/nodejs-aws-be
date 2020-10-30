import * as AWSLambda from "aws-lambda";

export function getProductByID(event: AWSLambda.APIGatewayEvent, _context: AWSLambda.Context) {
  return {
    statusCode: 200,
    body: `return product with id - ${event.pathParameters.productId}`,
  };
}
