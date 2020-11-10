import * as AWSLambda from "aws-lambda";
import { CORS_HEADERS } from "../cors-headers";
import { Client } from "pg";
import { dbOptions } from "./helper/db-config";
import { ApiError } from "./helper/api-error";

export const postProductToList = async (event: AWSLambda.APIGatewayEvent) => {
  const client = new Client(dbOptions);

  try {
    const { title, description, price, count } = JSON.parse(event.body);
    if (isQueryInValid(title, description, price, count)) {
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
        statusCode: 201,
        body: null,
        headers: CORS_HEADERS,
      };
    } else {
      throw new ApiError("InvalidParameters", 400, "invalid parameters");
    }
  } catch (e) {
    return {
      statusCode: e.statusCode || 500,
      error: JSON.stringify(Error(e.message)),
      headers: CORS_HEADERS,
    };
  } finally {
    client.end();
  }
};

const isQueryInValid = (title, description, price, count) => {
  if (
    !!price &&
    !!count &&
    !!title &&
    typeof price === "number" &&
    price > 0 &&
    typeof count === "number" &&
    count > 0 &&
    typeof title === "string" &&
    title.length > 0 &&
    typeof description === "string"
  ) {
    return true;
  }
  return false;
};
