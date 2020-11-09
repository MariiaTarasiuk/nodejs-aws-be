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
    isQueryInValid(title, description, price, count);

    await client.connect();
    const {
      rows: [{ id }],
    } = await client.query(`insert into products (title, description, price) values ($1, $2, $3) returning id`, [
      title,
      description,
      price,
    ]);
    await client.query(`insert into stocks (product_id, count) values ($1, $2)`, [id, count]);
    console.log(`SUCCESS post product ${title}:`, id);

    return {
      statusCode: 200,
      body: null,
      headers: CORS_HEADERS,
    };
  } catch (e) {
    return {
      statusCode: e.statusCode,
      error: JSON.stringify(Error(e.message)),
      headers: CORS_HEADERS,
    };
  } finally {
    client.end();
  }
};

const isQueryInValid = (title, description, price, count) => {
  if (
    typeof price !== "number" &&
    price < 0 &&
    typeof count !== "number" &&
    count > 0 &&
    typeof title !== "string" &&
    title.length < 0 &&
    typeof description !== "string"
  ) {
    throw new ApiError("InvalidParameters", 400, "invalid parameters");
  }
};

export class ApiError extends Error {
  private statusCode: number;
  constructor(name: string, statusCode: number, message?: string) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }
}
