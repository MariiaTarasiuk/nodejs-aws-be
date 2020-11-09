import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "../cors-headers";
import { Client, ClientConfig, QueryResult } from "pg";

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

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number;
}

export const getProductByID = async (event: AWSLambda.APIGatewayEvent) => {
  const client = new Client(dbOptions);

  try {
    await client.connect();
    const product_id = event.pathParameters.productId;
    const {
      rows,
    }: QueryResult<Product> = await client.query(
      "select count, title, description, price, product_id id from products p left join stocks s on $1 = s.product_id where p.id = $1",
      [product_id]
    );
    console.log(`SUCCESS get product ${product_id}: `, rows);
    if (!rows) {
      return {
        statusCode: 500,
        error: JSON.stringify(`Product with id ${event.pathParameters.productId} not found`),
        headers: CORS_HEADERS,
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify(rows),
        headers: CORS_HEADERS,
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      error: JSON.stringify(Error(e.message)),
      headers: CORS_HEADERS,
    };
  } finally {
    client.end();
  }
};
