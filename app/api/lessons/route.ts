import { NextRequest, NextResponse } from "next/server";
import dynamoDb from "@/lib/dynamo"; // default export from lib/dynamo is the document client
import { QueryCommand, type QueryCommandOutput, ScanCommand, type ScanCommandOutput } from "@aws-sdk/lib-dynamodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role") || "student";

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    let lessons: unknown[] = [];

    if (role === "tutor") {
      // ביצוע Scan פשוט ובטוח כדי למצוא את השיעורים של המורה
      // נסנן את כל הרשומות שהן LESSON# ומציגות את נדב כמורה
      const command = new ScanCommand({
        TableName: "Aleph1DB",
        FilterExpression: "begins_with(SK, :lessonPrefix) AND (tutorId = :tutorId)",
        ExpressionAttributeValues: {
          ":lessonPrefix": "LESSON#",
          ":tutorId": userId
        },
      });
      const response: ScanCommandOutput = await (dynamoDb as any).send(command as any);
      lessons = response.Items || [];
    } else {
      // לוגיקת הסטודנט המצוינת שלך
      const command = new QueryCommand({
        TableName: "Aleph1DB",
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        ExpressionAttributeValues: {
          ":pk": `USER#${userId}`,
          ":skPrefix": "LESSON#",
        },
      });
      const response: QueryCommandOutput = await (dynamoDb as any).send(command as any);
      lessons = response.Items || [];
    }

    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    console.error("Error fetching lessons from DynamoDB:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}