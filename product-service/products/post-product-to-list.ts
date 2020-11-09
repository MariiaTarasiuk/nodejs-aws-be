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

export const postProductToList = async (event: AWSLambda.APIGatewayEvent) => {
  const client = new Client(dbOptions);

  try {
    const { title, description, price, count } = JSON.parse(event.body);
    await client.connect();
    const {
      rows: [{ id }],
    } = await client.query(`insert into products (title, description, price) values ($1, $2, $3) returning id`, [
      title,
      description,
      price,
    ]);
    console.log(`SUCCESS post product ${title}:`, id);
    await client.query(`insert into stocks (product_id, count) values ($1, $2)`, [id, count]);

    return {
      statusCode: 200,
      body: null,
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
