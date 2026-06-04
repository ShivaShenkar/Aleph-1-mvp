import { NextRequest, NextResponse } from "next/server";
import dynamoDb from "@/lib/dynamo"; // ודא שהנתיב לחיבור הדיינמו שלך נכון
import { QueryCommand, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

// --- פונקציית השליפה (GET) ---
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
      // מורה: שולף את השיעורים שבהם הוא ה-tutorId
      const command = new ScanCommand({
        TableName: "Aleph1DB",
        FilterExpression: "begins_with(SK, :lessonPrefix) AND tutorId = :tutorId",
        ExpressionAttributeValues: {
          ":lessonPrefix": "LESSON#",
          ":tutorId": userId
        },
      });
      const response = await (dynamoDb as any).send(command as any);
      lessons = response.Items || [];
    } else {
      // סטודנט: שולף את כל השיעורים שמתחילים ב-LESSON# במערכת
      // הפרונטאנד (page.tsx) יבצע את סינון הקטגוריות והסטטוס
      const command = new ScanCommand({
        TableName: "Aleph1DB",
        FilterExpression: "begins_with(SK, :lessonPrefix)",
        ExpressionAttributeValues: {
          ":lessonPrefix": "LESSON#",
        },
      });
      const response = await (dynamoDb as any).send(command as any);
      lessons = response.Items || [];
    }

    return NextResponse.json(lessons, { status: 200 });
  } catch (error) {
    console.error("Error fetching lessons from DynamoDB:", error);
    return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
  }
}

// --- פונקציית היצירה (POST) ---
export async function POST(req: NextRequest) {
    try {
    const body = await req.json();
    const { userId, lessonId, tutorId } = body; // <-- מקבלים גם את tutorId

    if (!userId || !lessonId || !tutorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const command = new UpdateCommand({
      TableName: "Aleph1DB",
      Key: {
        PK: `USER#${tutorId}`, // מעדכנים את השיעור אצל המורה שייצר אותו!
        SK: lessonId,
      },
      UpdateExpression: "SET #stat = :newStatus, studentId = :studentId",
      ExpressionAttributeNames: {
        "#stat": "status",
      },
      ExpressionAttributeValues: {
        ":newStatus": "booked",
        ":studentId": userId, // ה-ID של הסטודנט שנרשם
      },
    });

    await (dynamoDb as any).send(command as any);

    return NextResponse.json({ message: "Successfully registered to lesson" }, { status: 200 });
  } catch (error) {
    console.error("Error registering to lesson:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
