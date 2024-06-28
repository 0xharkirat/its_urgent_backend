/* eslint-disable max-len */
import * as functions from "firebase-functions";
import admin from "../../core/admin";
import * as logger from "firebase-functions/logger";
import { notificationTypes } from "../../core/notificationTypes";


const firestore = admin.firestore();
const messaging = admin.messaging();

export const getFocusStatus = functions.https.onCall(async (data, context) =>{
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
    // const receiverName = receiver.data()?.name;
    const senderName = sender.data()?.name;

    const message = {
        data: {
            type: notificationTypes.getFocusStatus.toString(),
            receiverUid: receiverUid,
            senderUid: senderUid,
        },
        token: receiverdeviceToken,
    }

    try {
        await messaging.send(message);
        logger.info("Get Focus Status message sent successfully");
        return { message: "Get Focus Status message sent successfully" };
    } catch (error) {
        logger.error("Error sending Focus status message:", error);
        return { message: "Error sending Focus status message" };
    }
});
