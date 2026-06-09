
import {Amplify, type ResourcesConfig} from "aws-amplify"

const authConfig: ResourcesConfig["Auth"] = {
    Cognito:{
        userPoolId: String(import.meta.env.VITE_USER_POOL_ID),
        userPoolClientId: String(import.meta.env.VITE_COGNITO_CLIENT_ID),
        loginWith: {
            email: true
        },
        signUpVerificationMethod: 'code',
        // userAttributes: {
        //     email: { required: true },
        //     given_name: { required: true },
        //     family_name: { required: true },
        //     birthdate: { required: true },
        //     "custom:isTutor": { 
        //         dataType: "boolean", 
        //     },
        //     "custom:isStudent": { 
        //         dataType: "boolean",
        //      },
        // }, 
    },
};



const storageConfig: ResourcesConfig["Storage"] = {
    S3: {
        bucket: String(import.meta.env.VITE_S3_BUCKET_NAME),
        region: String(import.meta.env.VITE_COGNITO_REGION),
    },
};

Amplify.configure(
    {
        Auth:authConfig,
        Storage:storageConfig,
    },
);


