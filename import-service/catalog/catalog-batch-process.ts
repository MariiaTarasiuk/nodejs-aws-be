import * as AWSLambda from "aws-lambda";
import { Client } from "pg";
import { dbOptions } from "../helpres/db-config";

export const catalogBatchProcess = async (event: AWSLambda.SQSHandler) => {
  const DB = new Client(dbOptions);
  try {
    await DB.connect();
    const products = event.Records.map(async ({ body }) => {
      const { title, description, price, count } = JSON.parse(body);
      const {
        rows: [{ id }],
      } = await DB.query(`insert into products (title, description, price) values ($1, $2, $3) returning id`, [
        title,
        description,
        price,
      ]);
      console.log("# add product to Products DB # ", id);
      await DB.query(`insert into stocks (product_id, count) values ($1, $2)`, [id, count]);
      console.log(`add product ${title} to stocks:`, id);
    });
    const results = await Promise.all(products);
  } catch (error) {
    console.log("SOMETHING GOES WRONG: ", error);
  } finally {
    await DB.end();
  }
};
