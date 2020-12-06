import * as AWSLambda from "aws-lambda";

export const basicAuthorizer = async (event, context, cb) => {
  if (event["type"] !== "TOKEN") {
    cb("Unauthorized");
  }
  try {
    const encodedCreds = event.authorizationToken.replace("Basic ", "");
    const buff = Buffer.from(encodedCreds, "base64");
    const [username, password] = buff.toString("utf-8").split(":");
    const effect = process.env[username] !== password ? "Deny" : "Allow";
    console.log("basic Authorizer", effect);
    cb(null, generatePolicy(username, event.methodArn, effect));
  } catch (error) {
    console.log("Auth Error ", error);
    cb(error);
  }
};
const generatePolicy = (principalId, resource, effect = "Allow") => ({
  principalId: principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
