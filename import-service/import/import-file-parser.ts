import * as AWS from "aws-sdk";
import * as AWSLambda from "aws-lambda";

const csv = require("csv-parser");
const BUCKET = "app-import-storage";

export const importFileParser = (event: AWSLambda.S3Handler) => {
  const s3 = new AWS.S3({ region: "eu-west-1" });
  const sqs = new AWS.SQS({ region: "eu-west-1" });

  console.log("START parse data");
  event.Records.forEach((record) => {
    const s3Stream = s3.getObject({ Bucket: BUCKET, Key: record.s3.object.key }).createReadStream();

    s3Stream
      .pipe(csv())
      .on("data", async (data) => {
        try {
          await sqs.sendMessage({ QueueUrl: process.env.SQS_URL, MessageBody: JSON.stringify(data) }).promise();
          console.log("ADD new item to SQS: ", data);
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      })
      .on("end", async () => {
        try {
          await s3
            .copyObject({
              Bucket: BUCKET,
              CopySource: `${BUCKET}/${record.s3.object.key}`,
              Key: record.s3.object.key.replace("uploaded", "parsed"),
            })
            .promise();
          console.log(`COPY from ${BUCKET}/${record.s3.object.key}`);

          await s3
            .deleteObject({
              Bucket: BUCKET,
              Key: record.s3.object.key,
            })
            .promise();
          console.log(`DELETE - ${BUCKET}/${record.s3.object.key}`);
        } catch (error) {
          console.log("## PARSE ERROR ##", error);
        }
      });
  });
};
