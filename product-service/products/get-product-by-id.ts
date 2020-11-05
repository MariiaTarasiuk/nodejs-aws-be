import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "../cors-headers";
import productList from "./products.mock.json";

export const getProductByID = async (event: AWSLambda.APIGatewayEvent) => {
  try {
    const product = productList.products.find((product) => product.id === event.pathParameters.productId);
    if (!product) {
      return {
        statusCode: 500,
        error: JSON.stringify(`Product with id ${event.pathParameters.productId} not found`),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify(product),
        headers: CORS_HEADERS,
      };
    }
  } catch (e) {
    Error(e.message);
  }
};
