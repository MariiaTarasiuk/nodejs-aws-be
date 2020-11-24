import * as AWSLambda from "aws-lambda";
import * as AWS from "aws-sdk";
import { createProduct } from "./create-product";

export const catalogBatchProcess = async (event: AWSLambda.SQSHandler) => {
  const SNS = new AWS.SNS({ region: "eu-west-1" });
  try {
    const products = event.Records.map(async ({ body }) => {
      const { title, description, price, count } = JSON.parse(body);
      await createProduct({ title, description, price, count });
      await SNS.publish({
        Subject: "New product was added",
        Message: JSON.stringify(title),
        MessageAttributes: {
          isNormalProduct: { DataType: "String", StringValue: `${count >= 20}` },
        },
        TopicArn: process.env.SNS_ARN,
      }).promise();
      console.log("Send update email");
    });
    const results = await Promise.all(products);
  } catch (error) {
    console.log("SOMETHING GOES WRONG: ", error);
  }
};
