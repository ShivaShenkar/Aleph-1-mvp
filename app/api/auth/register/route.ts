import { NextResponse } from "next/server";
import dynamoDb from "@/lib/dynamo"; // ודא שהנתיב ל-lib/dynamo תואם למבנה שלך
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export async function POST(request: Request) {
  try {
    // 1. קריאת הנתונים שנשלחו מהפרונטאנד
    const body = await request.json();
    const { userId, email, name, role } = body;

    // בדיקת תקינות בסיסית של הפרטים
    if (!userId || !email || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. הגדרת שם הטבלה מתוך משתני הסביבה
    const tableName = process.env.DYNAMODB_TABLE_NAME || "Aleph1DB";

    // 3. הכנת האובייקט לפי מודל ה-Single-Table Design שהגדרנו
    const putParams = {
      TableName: tableName,
      Item: {
        PK: `USER#${userId}`,       // המפתח הראשי שמזהה את המשתמש בקוגניטו
        SK: "PROFILE",              // מפתח המיון שמגדיר שזו שורת הפרופיל שלו
        email: email.toLowerCase().trim(),
        name: name.trim(),
        role: role,                 // "student" או "tutor"
        createdAt: new Date().toISOString(),
      },
    };

    // 4. שמירת הנתונים בפועל ב-DynamoDB
    await (dynamoDb as any).send(new PutCommand(putParams) as any);

    // 5. החזרת תשובת הצלחה לפרונטאנד
    return NextResponse.json(
      { message: "User registered successfully in database" },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error saving user to DynamoDB:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}