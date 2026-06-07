import { NextRequest, NextResponse } from "next/server";
import dynamoDb from "@/lib/dynamo";
import { QueryCommand, type QueryCommandOutput } from "@aws-sdk/lib-dynamodb";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tutorId = searchParams.get("tutorId");

    if (!tutorId) {
      return NextResponse.json({ error: "Missing tutorId" }, { status: 400 });
    }

    // שאילתה לשליפת כל הנתונים תחת ה-PK של המורה ספציפי
    // זה יביא לנו גם את שורת הפרופיל שלו וגם שורות מסוג ביקורות/שיעורים
    const command = new QueryCommand({
      TableName: "Aleph1DB",
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": `USER#${tutorId}`,
      },
    });

    const response: QueryCommandOutput = await (dynamoDb as any).send(command as any);
    const items: Record<string, unknown>[] = (response.Items as Record<string, unknown>[]) || [];

    // סינון הנתונים שחזרו מה-Query
    const profile = items.find((item: Record<string, unknown>) => item.role === "tutor");
    
    // שליפת ביקורות (נניח שהן נשמרות עם SK שמתחיל ב-REVIEW#)
    // אם עוד אין לכם שורות כאלה, נחזיר מערך ריק או דאמי למחצה בינתיים
    const reviews = items.filter((item: Record<string, unknown>) =>typeof item.SK === "string" && item.SK.startsWith("REVIEW#")) || [];

    if (!profile) {
      return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
    }

    return NextResponse.json({ profile, reviews }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tutor full profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}