/* eslint-disable max-len */
import * as functions from "firebase-functions";
import admin from "../../core/admin";
import * as logger from "firebase-functions/logger";
import { notificationTypes } from "../../core/notificationTypes";


const firestore = admin.firestore();
const messaging = admin.messaging();

export const sendNotification = functions.https.onCall(async (data, context) =>{
    // create a function which first check from firestore db that whether the user with uid exists or not
    const senderUid = data.senderUid;
    const receiverUid = data.receiverUid;
    const focusStatus = data.focusStatus;

    // create a function which first check from firestore db that whether the user with uid exists or not
    const userRef = firestore.doc(`users/${receiverUid}`);
    const senderRef = firestore.doc(`users/${senderUid}`);
    const sender = await senderRef.get();
    const receiver = await userRef.get();

    if (!receiver.exists) {
        logger.error(`User with uid: ${receiverUid} not found`);
        return {message: `User not found with ${receiverUid}`};
    }

    const receiverDeviceToken = receiver.data()?.deviceToken;
    const senderDeviceToken = sender.data()?.deviceToken;

    const receiverName = receiver.data()?.name;
    const senderName = sender.data()?.name;

    const messageToReceiver = {
        notification: {
            title: `Notification from ${senderName}`,
            body: `${senderName} has accessed your dnd status.`,
        },
        data: {
            type: notificationTypes.receivedSuccessfully.toString(),
            senderUid: senderUid,
        },
        token: receiverDeviceToken,
    }

    try {
        await messaging.send(messageToReceiver);
        logger.info("Message sent to receiver about the successful delivery");
    } catch (error) {
        logger.error(`Error sending message to receiver about the successful delivery: ${error}`);
    }

    // send message to sender
    const messageToSender = {
        notification: {
            title: "Notification sent successfully",
            body: `Your notification to ${receiverName} has been sent successfully`,
        },
        data: {
            type: notificationTypes.sentSuccessfully.toString(),
            receiverUid: receiverUid,
            focusStatus: focusStatus.toString(),
        },
        token: senderDeviceToken,
    }

    try {
        await messaging.send(messageToSender);
        logger.info("Message sent to sender about the successful delivery");
    } catch (error) {
        logger.error(`Error sending message to sender about the successful delivery: ${error}`);
    }

    return { message: "Notification sent to sender and receiver about the successful delivery" };


    // if (focusStatus == 0) {
    //     // only send message to sender, as couldn't get the focus status.
    //     const messageToSender = {
    //         notification: {
    //             title: "Error getting DND Status",
    //             body: `Cannot get the DND status of ${receiverName}. Please try again some time later`,
    //         },
    //         data: {
    //             type: notificationTypes.errorGettingFocusStatus.toString(),
    //             receiverUid: receiverUid,
    //         },
    //         token: senderDeviceToken,
    //     }

    //     try {
    //         await messaging.send(messageToSender);
    //         logger.info("Message sent to sender about the DND status error");
    //     } catch (error) {
    //         logger.error(`Error sending message to sender about the DND status error: ${error}`);
    //     }

    //     return { message: "Notification sent to sender about the DND status error" };
    // } else if (focusStatus == 1) {
    //     // send message to both sender and receiver, as receiver is not in DND mode
    //     // send message to receiver
    //     const messageToReceiver = {
    //         notification: {
    //             title: `Notification from ${senderName}`,
    //             body: `${senderName} is sending you an urgent notification, please call them.`,
    //         },
    //         data: {
    //             type: notificationTypes.receivedSuccessfully.toString(),
    //             senderUid: senderUid,
    //         },
    //         token: receiverDeviceToken,
    //     }

    //     try {
    //         await messaging.send(messageToReceiver);
    //         logger.info("Message sent to receiver about the successful delivery");
    //     } catch (error) {
    //         logger.error(`Error sending message to receiver about the successful delivery: ${error}`);
    //     }

    //     // send message to sender
    //     const messageToSender = {
    //         notification: {
    //             title: "Notification sent successfully",
    //             body: `Your notification to ${receiverName} has been sent successfully`,
    //         },
    //         data: {
    //             type: notificationTypes.sentSuccessfully.toString(),
    //             receiverUid: receiverUid,
    //         },
    //         token: senderDeviceToken,
    //     }

    //     try {
    //         await messaging.send(messageToSender);
    //         logger.info("Message sent to sender about the successful delivery");
    //     } catch (error) {
    //         logger.error(`Error sending message to sender about the successful delivery: ${error}`);
    //     }

    //     return { message: "Notification sent to sender and receiver about the successful delivery" };
    // } else {
    //     // send message to only sender, as receiver is in DND mode
    //     const messageToSender = {
    //         notification: {
    //             title: "Cannot send notification",
    //             body: `${receiverName} is in DND mode. Please try again later.`,
    //         },
    //         data: {
    //             type: notificationTypes.dndOn.toString(),
    //             receiverUid: receiverUid,
    //         },
    //         token: senderDeviceToken,
    //     }
    //     try {
    //         await messaging.send(messageToSender);
    //         logger.info("Message sent to sender about the DND mode");
    //     } catch (error) {
    //         logger.error(`Error sending message to sender about the DND mode: ${error}`);
    //     }

    //     return { message: "Notification sent to sender about the DND mode" };
    // }
});
