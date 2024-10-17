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
