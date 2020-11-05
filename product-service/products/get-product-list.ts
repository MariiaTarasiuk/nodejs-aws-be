import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "../cors-headers";
import productList from "./products.mock.json";

export async function getProductList(
  event: AWSLambda.APIGatewayEvent,
  _context: AWSLambda.Context,
  callback: AWSLambda.Callback
) {
  try {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(productList),
      headers: CORS_HEADERS,
    });
  } catch (e) {
    callback(Error(e));
  }
}
