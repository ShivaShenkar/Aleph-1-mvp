import { NextRequest, NextResponse } from "next/server";
import dynamoDb from "@/lib/dynamo";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, lessonId } = body; 

    if (!userId || !lessonId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // עדכון הפריט בדיינמו: מחזירים ל-scheduled ומוחקים את ה-studentId לחלוטין
    const command = new UpdateCommand({
      TableName: "Aleph1DB",
      Key: {
        PK: `USER#${userId}`, 
        SK: lessonId,
      },
      UpdateExpression: "SET #stat = :newStatus REMOVE studentId",
      ExpressionAttributeNames: {
        "#stat": "status",
      },
      ExpressionAttributeValues: {
        ":newStatus": "scheduled", // מחזיר את השיעור למצב זמין
      },
    });

    await (dynamoDb as any).send(command as any);

    return NextResponse.json({ message: "Successfully canceled lesson registration" }, { status: 200 });
  } catch (error) {
    console.error("Error canceling lesson registration in DynamoDB:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}