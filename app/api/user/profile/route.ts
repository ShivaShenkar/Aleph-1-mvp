import { NextResponse } from "next/server";
import dynamoDb from "@/lib/dynamo";
import { GetCommand, type GetCommandOutput } from "@aws-sdk/lib-dynamodb";

export async function GET(request: Request) {
  try {
    // 1. חילוץ ה-userId מתוך ה-URL Query Parameters (למשל: /api/user/profile?userId=123)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const tableName = process.env.DYNAMODB_TABLE_NAME || "Aleph1DB";

    // 2. הגדרת המפתחות לשליפה מדויקת של הפרופיל
    const getParams = {
      TableName: tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: "PROFILE",
      },
    };

    // 3. ביצוע השליפה מתוך DynamoDB
    const response: GetCommandOutput = await (dynamoDb as any).send(
      new GetCommand(getParams) as any
    );

    // 4. אם המשתמש לא נמצא בטבלה
    if (!response.Item) {
      return NextResponse.json(
        { error: "User profile not found in database" },
        { status: 404 }
      );
    }

    // 5. החזרת נתוני הפרופיל לפרונטאנד
    return NextResponse.json(response.Item, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching user from DynamoDB:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}