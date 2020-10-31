import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "./cors-headers";

export function getProductByID(event: AWSLambda.APIGatewayEvent, _context: AWSLambda.Context) {
  try {
    return {
      statusCode: 200,
      body: `return product with id - ${event.pathParameters.productId}`,
      headers: CORS_HEADERS,
    };
  } catch {
    return {
      headers: CORS_HEADERS,
      statusCode: 500,
      error: "ERROR: provide product ID",
    };
  }
}
