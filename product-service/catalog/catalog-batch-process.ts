import * as AWSLambda from "aws-lambda";
import { Client } from "pg";
import { dbOptions } from "../products/helper/db-config";
import * as AWS from "aws-sdk";

export const catalogBatchProcess = async (event: AWSLambda.SQSHandler) => {
  const DB = new Client(dbOptions);
  const SNS = new AWS.SNS({ region: "eu-west-1" });
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
      console.log("add product to Products: ", title);
      if (!!id) {
        const rows = await DB.query(`insert into stocks (product_id, count) values ($1, $2)`, [id, count]);
        console.log(`add product ${title} to Stocks:`, id);
        await SNS.publish({
          Subject: "New product was added",
          Message: JSON.stringify(title),
          MessageAttributes: {
            isNormalProduct: { DataType: "String", StringValue: `${count >= 20}` },
          },
          TopicArn: process.env.SNS_ARN,
        }).promise();
        console.log("Send update email");
      }
    });
    const results = await Promise.all(products);
  } catch (error) {
    console.log("SOMETHING GOES WRONG: ", error);
  } finally {
    await DB.end();
  }
};
