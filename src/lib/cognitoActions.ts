
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resendSignUpCode,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";
 import { getErrorMessage } from "@/utils/get-error-message";
 import { useNavigate } from "react-router-dom";




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
          "custom:isTutor": String(formData.get("role")=== "tutor"),
          "custom:isStudent": String(formData.get("role")=== "student"),
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

export function useHandleSignOut() {
  const navigate = useNavigate();
  
  return async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.log(getErrorMessage(error));
    }
  };
}

export async function getUser(){
  try{
    const currentUser = await getCurrentUser();
    const session = await fetchAuthSession();
    if (!currentUser || !session) {
      return;
    }
    const idToken = session.tokens?.idToken;

    const roles: string[] = [];
    // @ts-ignore
    if(idToken?.payload['custom:isTutor'] === "true") {
      roles.push("tutor");
    }
    // @ts-ignore
    if(idToken?.payload['custom:isStudent'] === "true") {
      roles.push("student");
    }
    // @ts-ignore
    const givenName = idToken?.payload['given_name'] as string | undefined;
    // @ts-ignore
    const familyName = idToken?.payload['family_name'] as string | undefined;
    return{
      ...currentUser,
      roles,
      givenName,
      familyName,
    }
  }
  catch(error:unknown){
    console.error("Error fetching user:", error);
  }
  return null;
}