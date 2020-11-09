import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "../cors-headers";
import { Client, ClientConfig } from "pg";

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;
const dbOptions: ClientConfig = {
  host: DB_HOST,
  port: +DB_PORT,
  database: DB_DATABASE,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
};

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
