"use server";

import {
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  AdminAddUserToGroupCommand,
  AdminListGroupsForUserCommand,
  UserNotConfirmedException,
} from "@aws-sdk/client-cognito-identity-provider";
import { cookies } from "next/headers";
import { cognitoClient, COGNITO_CLIENT_ID, USER_POOL_ID } from "@/lib/cognito";

function getAge(birthdate: string): number {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const birthdate = formData.get("birthdate") as string;
  const role = formData.get("role") as string;

  const minAge = role === "tutor" ? 17 : 13;
  if (getAge(birthdate) < minAge) {
    const label = role === "tutor" ? "מורה" : "תלמיד";
    return {
      success: false as const,
      error: `עליך להיות בן ${minAge} לפחות כדי להירשם כ${label}`,
    };
  }

  try {
    const command = new SignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "given_name", Value: firstName },
        { Name: "family_name", Value: lastName },
        { Name: "birthdate", Value: birthdate },
      ],
    });

    await cognitoClient.send(command);

    const groupName = role === "tutor" ? "Tutors" : "Students";
    try {
      await cognitoClient.send(
        new AdminAddUserToGroupCommand({
          UserPoolId: USER_POOL_ID,
          Username: email,
          GroupName: groupName,
        })
      );
    } catch {
      // Group assignment failure should not block signup
    }

    return { success: true as const };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "שגיאה בהרשמה";
    return { success: false as const, error: message };
  }
}

export async function confirmSignUp(email: string, code: string) {
  try {
    const command = new ConfirmSignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
    });
    await cognitoClient.send(command);
    return { success: true as const };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "שגיאה באימות";
    return { success: false as const, error: message };
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const result = await cognitoClient.send(command);

    const accessToken = result.AuthenticationResult?.AccessToken;
    const refreshToken = result.AuthenticationResult?.RefreshToken;

    if (!accessToken) {
      return { success: false as const, error: "התחברות נכשלה" };
    }

    const cookieStore = await cookies();
    cookieStore.set("session_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    if (refreshToken) {
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    let role: "student" | "tutor" = "student";

    const groupsResult = await cognitoClient.send(
        new AdminListGroupsForUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: email,
        })
      );
      console.log(groupsResult);
      const groupNames = groupsResult.Groups?.map((g) => g.GroupName) ?? [];
      console.log("User groups:", groupNames);
      role = groupNames.includes("Tutors") ? "tutor" : "student";

    return { success: true as const, role };
  } catch (error: unknown) {
    console.error("Sign-in error:", error);
    const message =
      error instanceof Error ? error.message : "שגיאה בהתחברות";
    return { success: false as const, error: message };
  }
}
export interface CurrentUser {
  sub: string;
  email: string;
  role: "student" | "tutor";
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const groups: string[] = payload["cognito:groups"] ?? [];
    const role = groups.includes("Tutors") ? "tutor" : "student";

    return {
      sub: payload.sub,
      email: payload.email,
      role,
    };
  } catch {
    return null;
  }
}