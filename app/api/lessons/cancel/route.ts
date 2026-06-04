import { NextRequest, NextResponse } from "next/server";
import dynamoDb from "@/lib/dynamo";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lessonId, tutorId } = body; // <-- צריכים את ה-tutorId של השיעור

    if (!lessonId || !tutorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const command = new UpdateCommand({
      TableName: "Aleph1DB",
      Key: {
        PK: `USER#${tutorId}`, // ניגשים לשיעור אצל המורה
        SK: lessonId,
      },
      UpdateExpression: "SET #stat = :newStatus REMOVE studentId",
      ExpressionAttributeNames: {
        "#stat": "status",
      },
      ExpressionAttributeValues: {
        ":newStatus": "scheduled", // מחזיר למצב פנוי
      },
    });

    
    await (dynamoDb as any).send(command as any);
    

    return NextResponse.json({ message: "Successfully canceled registration" }, { status: 200 });
  } catch (error) {
    console.error("Error canceling registration:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
