# Its Urgent Backend

This is backend for [It's Urgent Flutter Project](https://github.com/0xharkirat/its_urgent). It uses Typescript on Firebase Cloud Functions.

## Project Structure
Main backend code can be found in `functions/src` directory

To avoid writing all functions in one single file `index.ts`, I am using a feature first project structure which is as follows (NOTE: This is not necessary):


```
/src
├───core/
├───feature1/
│   ├───reactive/
│   └───restful/
├───feature2/
│   ├───reactive/
│   └───restful/
└───feature3/...
```

+ `src/index.ts` only contains all the imports from subdirectories like:
    ```ts
    import {helloWorld} from "./hello-world/restful/helloWorld";
    import {createUserRef} from "./auth/reactive/createUserRef";
    import {deleteUserRef} from "./auth/reactive/deleteUserRef";

    // this code is required to deploy the imported cloud functions
    export { helloWorld, createUserRef, deleteUserRef};
    ```
+ `src/core/` - Contains all the core functionality which can be common like:
    ```ts
    // filepath: src/core/admin.ts

    import * as admin from "firebase-admin";

    if (!admin.apps.length) {
    admin.initializeApp();
    }

    export default admin;
    ```

+ Each `src/feature/` subfolder contains two subfolders -> `reactive/` & `restful/`.

    + `reactive/` - Contains all the cloud functions which are triggered (reactive) in response to firebase products events. 

    - Here are a few examples of things that you can do with Cloud Functions triggers:

        + Authentication trigger to send a welcome email when a new user signs in.
        + Receive an email or a Slack notification when a new issue is discovered in Crashlytics.
        + Generate a thumbnail when a user uploads an image to Firebase Storage.
        + Moderate or remove any offensive words that are entered by a user inside your app.
        + Send a FCM notification to users in your app (useful for chat applications).
        + Index your Firestore DB and implement full-text search by tapping into external services like Algolia.

        ```ts
        // filepath: src/auth/reactive/createUserRef.ts

        import * as logger from "firebase-functions/logger";
        import * as functionsV1 from "firebase-functions/v1";
        import admin from "../../core/admin";


        // Create a new userRef in Firestore when a new user is created in Firebase Auth
        export const createUserRef = functionsV1.auth.user().onCreate((user) => {
            const phoneNumber = user.phoneNumber?.replace(/\s+/g, ""); //remove spaces from phone number
            const userRef = admin.firestore().doc(`usersRef/${phoneNumber}`);

            logger.info(`New userRef created: ${phoneNumber}`);
            return userRef.set({
                uid: user.uid,
            });
        });
        ```


    + `restful/` - Contains all the cloud functions which are callable from client like `http` resful apis.

        ```js
        // filepath: 'src/hello-world/restful/helloWorld.ts'

        import {onRequest} from "firebase-functions/v2/https";
        import * as logger from "firebase-functions/logger";


        export const helloWorld = onRequest((request, response) => {
            response.send("Hello World!");
        });
    
        ```
        + When someone calls this api endpoint like `http://<localhost_or_hosted_url>/<your_firebase project_id>/us-central1/helloWorld`

            output response:
            ```
            Hello World!
            ```

## Useful Links & Resources (Ctrl/Cmd + click to open in new tab)
+ See a full list of supported triggers at https://firebase.google.com/docs/functions
+ Start writing functions from https://firebase.google.com/docs/functions/typescript
+ File Structure Guide for Complex backend on cloud functions: [Serverless computing YouTube Video](https://youtu.be/W_VV2Fx32_Y?si=htF_FmgYC9JwJ6lJ&t=126)
+ Learn how to setup your first project using Cloud Functions for Firebase. Includes additional resources about Node.js and the Firebase CLI at https://codewithandrea.com/articles/firebase-cloud-functions/