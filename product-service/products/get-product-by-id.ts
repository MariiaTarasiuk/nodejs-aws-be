import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "../cors-headers";
import productList from "./products.mock.json";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
}

export const getProductByID = async (event: AWSLambda.APIGatewayEvent) => {
  try {
    const product: Product = productList.products.find((product) => product.id === event.pathParameters.productId);
    if (!product) {
      return {
        statusCode: 500,
        error: JSON.stringify(`Product with id ${event.pathParameters.productId} not found`),
        headers: CORS_HEADERS,
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify(product),
        headers: CORS_HEADERS,
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      error: JSON.stringify(Error(e.message)),
      headers: CORS_HEADERS,
    };
  }
};
