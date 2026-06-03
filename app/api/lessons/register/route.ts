import { NextRequest, NextResponse } from "next/server";
import dynamoDb from "@/lib/dynamo";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, lessonId } = body; // lessonId הוא למעשה ה-SK של השיעור (למשל LESSON#20260610_1500)

    if (!userId || !lessonId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // עדכון הפריט בדיינמו: משנים סטטוס ומוסיפים את מזהה הסטודנט
    const command = new UpdateCommand({
      TableName: "Aleph1DB",
      Key: {
        PK: `USER#${userId}`, // השיעור כרגע יושב תחת ה-PK של המשתמש
        SK: lessonId,
      },
      UpdateExpression: "SET #stat = :newStatus, studentId = :studentId",
      ExpressionAttributeNames: {
        "#stat": "status", // status היא מילה שמורה בדיינמו, לכן משתמשים באליאס
      },
      ExpressionAttributeValues: {
        ":newStatus": "booked", // משנים ל-booked כדי שלא יופיע יותר ב"פנויים"
        ":studentId": userId,
      },
    });

    await (dynamoDb as any).send(command as any);

    return NextResponse.json({ message: "Successfully registered to lesson" }, { status: 200 });
  } catch (error) {
    console.error("Error registering to lesson in DynamoDB:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}