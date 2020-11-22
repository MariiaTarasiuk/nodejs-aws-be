import * as AWSLambda from "aws-lambda";
import { Client } from "pg";
import { dbOptions } from "../helpres/db-config";

export const catalogBatchProcess = async (event: AWSLambda.SQSHandler) => {
  const products = event.Records.map(({ body }) => JSON.parse(body));
  const DB = new Client(dbOptions);
  console.log("WHAT IS PRODUCTS :", products, Array.isArray(products));
  try {
    await DB.connect();
    if (products.length > 0) {
      console.log("# DB instance # :", dbOptions);
      await Promise.all(
        products.map(({ title, description, price, count }) => {
          const {
            rows: [{ id }],
          } = DB.query(`insert into products (title, description, price) values ($1, $2, $3) returning id`, [
            title,
            description,
            price,
          ]);
          console.log("# add product to Products DB # ", id);
          DB.query(`insert into stocks (product_id, count) values ($1, $2)`, [id, count]);
          console.log(`SUCCESS post product ${title}:`, id);
        })
      );
    }
  } catch (error) {
    console.log("SOMETHING GOES WRONG: ", error);
  } finally {
    await DB.end();
  }
};
