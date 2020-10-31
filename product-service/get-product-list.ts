import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "./cors-headers";
import * as productList from "./products.mock.json";

export function getProductList(event: AWSLambda.APIGatewayEvent, _context: AWSLambda.Context) {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(productList),
      headers: CORS_HEADERS,
    };
  } catch {
    return {
      headers: CORS_HEADERS,
      statusCode: 500,
      error: "ERROR: can't get product list",
    };
  }
}
