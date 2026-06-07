import { NextRequest, NextResponse } from "next/server";
import dynamoDb from "@/lib/dynamo";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, profileSK, name, about } = body;

    if (!userId || !profileSK) {
      return NextResponse.json({ error: "Missing userId or profileSK" }, { status: 400 });
    }

    // עדכון שורת הפרופיל של המורה (שבה ה-PK הוא USER#id וה-SK הוא גם USER#id או PROFILE#)
    // הערה: ודא מהו ה-SK של שורת הפרופיל אצלך בטבלה. לפי הצילומים הקודמים, שורת הפרופיל משתמשת ב-SK שהוא ה-userId עצמו או קבוע.
    const command = new UpdateCommand({
      TableName: "Aleph1DB",
      Key: {
        PK: `USER#${userId}`,
        SK: profileSK, // <-- שנה לפורמט ה-SK של הפרופיל אצלך אם הוא שונה (למשל 'PROFILE')
      },
      UpdateExpression: "SET #name = :name, about = :about",
      ExpressionAttributeNames: {
        "#name": "name", // 'name' היא מילה שמורה בדיינמו, לכן משתמשים ב-Alias
      },
      ExpressionAttributeValues: {
        ":name": name,
        ":about": about,
      },
    });

    await (dynamoDb as any).send(command as any);

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating tutor profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}