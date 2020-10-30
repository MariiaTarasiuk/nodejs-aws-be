import * as AWSLambda from "aws-lambda";

export function getProductByID(event: AWSLambda.APIGatewayEvent, _context: AWSLambda.Context) {
  try {
    return {
      statusCode: 200,
      body: `return product with id - ${event.pathParameters.productId}`,
    };
  } catch {
    return { statusCode: 500, error: "ERROR: plz provide product ID" };
  }
}
