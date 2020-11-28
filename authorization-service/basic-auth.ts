import * as AWSLambda from "aws-lambda";

export const basicAuthorizer = async (event: AWSLambda, context, cb) => {
  if (event["type"] !== "TOKEN") {
    cb("Unauthorized");
  }
  try {
    const encodedCreds = event.queryStringParameters.token;
    const buff = Buffer.from(encodedCreds, "base64");
    const [username, password] = buff.toString("utf-8").split(":");
    const effect = process.env[username] !== password ? "Deny" : "Allow";
    cb(null, generatePolicy(encodedCreds, event.methodArn, effect));
  } catch (error) {
    cb(error.message);
  }
};
const generatePolicy = (principalId, resource, effect = "Allow") => ({
  principaId: principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Recource: resource,
      },
    ],
  },
});
