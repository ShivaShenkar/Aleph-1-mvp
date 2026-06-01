import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION || "us-east-1",
});

export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || "";
export const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || "";
