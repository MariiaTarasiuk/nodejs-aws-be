import * as AWSLambda from "aws-lambda";
import { Client } from "pg";
import { dbOptions } from "../helpres/db-config";

export const catalogBatchProcess = async (event: AWSLambda.SQSHandler) => {
  console.log("LAMBDA");
  const products = event.Records.map(({ body }) => body);
  console.log("# catalogBatchProcess # :", products);
  try {
    const DB = new Client(dbOptions);
    await DB.connect();
    await products.forEach(({ title, description, price, count }) => {
      const {
        rows: [{ id }],
      } = DB.query(`insert into products (title, description, price) values ($1, $2, $3) returning id`, [
        title,
        description,
        price,
      ]);
      DB.query(`insert into stocks (product_id, count) values ($1, $2)`, [id, count]);
      console.log(`SUCCESS post product ${title}:`, id);
    });
  } catch (error) {
    console.log("SOMETHING GOES WRONG: ", error);
  } finally {
    DB.end();
  }
};
