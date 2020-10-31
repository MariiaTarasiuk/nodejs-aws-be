import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "./cors-headers";
import productList from "./products.mock.json";

export function getProductByID(
  event: AWSLambda.APIGatewayEvent,
  _context: AWSLambda.Context,
  callback: AWSLambda.Callback
) {
  try {
    let responce;
    const product = productList.products.find((product) => product.id === event.pathParameters.productId);
    if (!product) {
      responce = {
        statusCode: 404,
        error: JSON.stringify(`Product with id ${event.pathParameters.productId} not found`),
        headers: CORS_HEADERS,
      };
    } else {
      responce = {
        statusCode: 200,
        body: JSON.stringify(product),
        headers: CORS_HEADERS,
      };
    }
    return callback(null, responce);
  } catch {
    let responce = {
      headers: CORS_HEADERS,
      statusCode: 500,
      error: "ERROR: provide product ID",
    };
    return callback(null, responce);
  }
}
