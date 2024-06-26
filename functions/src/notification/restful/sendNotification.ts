/* eslint-disable max-len */
import * as functions from "firebase-functions";
import admin from "../../core/admin";
import * as logger from "firebase-functions/logger";


const firestore = admin.firestore();
const messaging = admin.messaging();

export const sendNotification = functions.https.onCall(async (data, context) =>{
    // create a function which first check from firestore db that whether the user with uid exists or not
    const senderUid = data.senderUid;
    const receiverUid = data.receiverUid;
    const userRef = firestore.doc(`users/${receiverUid}`);
    const senderRef = firestore.doc(`users/${senderUid}`);
    const sender = await senderRef.get();
    const receiver = await userRef.get();

    if (!receiver.exists) {
        logger.error(`User with uid: ${receiverUid} not found`);
        return {message: `User not found with ${receiverUid}`};
    }

    const receiverdeviceToken = receiver.data()?.deviceToken;
    const receiverName = receiver.data()?.name;
    const senderName = sender.data()?.name;

    const message = {
        notification: {
            title: `New message from ${senderName}`,
            body: "Hello World",
        },
        token: receiverdeviceToken,
    }

    try {
        await messaging.send(message);
    } catch (error) {
        console.log("Error sending message:", error);
    }


    logger.info(`User found with: ${receiverUid}`);
    return {message: `user found with uid: ${receiverUid}, deviceToken: ${receiverdeviceToken}, name: ${receiverName} from sender: ${senderName}`};
});
