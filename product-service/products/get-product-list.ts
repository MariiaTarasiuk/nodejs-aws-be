import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "../cors-headers";
import { Client } from "pg";
import { dbOptions } from "./helper/db-config";

export const getProductList = async (event: AWSLambda.APIGatewayEvent) => {
  const client = new Client(dbOptions);

  try {
    await client.connect();
    const { rows } = await client.query(
      `select count, title, description, price, product_id id from stocks join products on stocks.product_id = products.id`
    );
    console.log("SUCCESS data from DB: ", rows);

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
      headers: CORS_HEADERS,
    };
  } catch (e) {
    console.error("ERROR during DB request: ", e.message);
    return {
      statusCode: 500,
      error: JSON.stringify(Error(e)),
      headers: CORS_HEADERS,
    };
  } finally {
    client.end();
  }
};
