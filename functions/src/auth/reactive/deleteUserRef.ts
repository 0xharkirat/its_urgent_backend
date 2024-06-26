import * as logger from "firebase-functions/logger";
import * as functionsV1 from "firebase-functions/v1";
import admin from "../../core/admin";


// Delete userRef from Firestore when a user is deleted from Firebase Auth
export const deleteUserRef = functionsV1.auth.user().onDelete((user) => {
    const phoneNumber = user.phoneNumber?.replace(/\s+/g, ""); //remove spaces from phone number
    const userRef = admin.firestore().doc(`usersRef/${phoneNumber}`);

    logger.info(`UserRef deleted: ${phoneNumber}`);
    return userRef.delete();
});

