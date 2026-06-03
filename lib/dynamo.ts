import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// אתחול ה-Client הבסיסי של AWS עם ה-Region הנכון
const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_COGNITO_REGION || "us-east-1",
  // במעבדות AWS, ה-SDK מושך אוטומטית את ה-Credentials (מפתחות הגישה) מהסביבה של המחשב שלך
});

// שימוש ב-DocumentClient שמקל עלינו ומאפשר לעבוד עם אובייקטים רגילים של JS (במקום הפורמט המסורבל של DynamoDB)
const dynamoDb = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true, // מונע שגיאות אם שדה מסוים נשלח כ-undefined
  },
});

export default dynamoDb;