import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "../cors-headers";
import productList from "./products.mock.json";

export const getProductList = async (event: AWSLambda.APIGatewayEvent) => {
  try {
    const produsts = productList.products;
    return {
      statusCode: 200,
      body: JSON.stringify(produsts),
      headers: CORS_HEADERS,
    };
  } catch (e) {
    return {
      statusCode: 500,
      error: JSON.stringify(Error(e)),
      headers: CORS_HEADERS,
    };
  }
};
