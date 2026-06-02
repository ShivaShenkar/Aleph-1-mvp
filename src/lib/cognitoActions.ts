
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
} from "aws-amplify/auth";
 import { getErrorMessage } from "@/utils/get-error-message";


export async function handleSignUp(
  formData: FormData
) {
  try {
    // const { isSignUpComplete, userId, nextStep } = 
    await signUp({
      username: String(formData.get("email")),
      password: String(formData.get("password")),
      options: {
        userAttributes: {
          email: String(formData.get("email")),
          given_name: String(formData.get("firstName")),
          family_name: String(formData.get("lastName")),
          birthdate: String(formData.get("birthdate")),
        },
        // optional
        autoSignIn: true,
      },
    });
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
  return { success: true, message: "Sign-up successful!"};
}

export async function handleSendEmailVerificationCode(
  prevState: { message: string; errorMessage: string },
  formData: FormData
) {
  let currentState;
  try {
    await resendSignUpCode({
      username: String(formData.get("email")),
    });
    currentState = {
      ...prevState,
      message: "Code sent successfully",
    };
  } catch (error) {
    currentState = {
      ...prevState,
      errorMessage: getErrorMessage(error),
    };
  }

  return currentState;
}

export async function handleConfirmSignUp(
 email:string,code:string
) {
  try {
    // const { isSignUpComplete, nextStep } = 
    await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
    // await autoSignIn();
  }
  catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
  return { success: true, message: "Sign-up confirmed successfully!" };
}

export async function handleSignIn(
  formData: FormData
) {
  try {
    const { nextStep } = 
    await signIn({
      username: String(formData.get("email")),
      password: String(formData.get("password")),
    });
    if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
      await resendSignUpCode({
        username: String(formData.get("email")),
      });
      return {isVerified: false, success: false, message: "Account not verified. Verification code resent."};
    }
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }

  return {isVerified: true, success: true, message: "Sign-in successful!"};
}

export async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log(getErrorMessage(error));
  }
  redirect("/auth/login");
}