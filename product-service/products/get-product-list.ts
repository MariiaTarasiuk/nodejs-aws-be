import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "../cors-headers";
import productList from "./products.mock.json";

export const getProductList = async (event: AWSLambda.APIGatewayEvent) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(productList),
      headers: CORS_HEADERS,
    };
  } catch (e) {
    Error(e).message;
  }
};
