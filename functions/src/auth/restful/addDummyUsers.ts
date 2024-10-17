// addDummyUsers.ts
import * as functions from "firebase-functions";
import admin from "../../core/admin";
import * as logger from "firebase-functions/logger";

const db = admin.firestore();

function generateRandomPhoneNumber() {
    const countryCodes = ["+1", "+44", "+91", "+81", "+61"]; // Add more country codes as needed
    const countryCode = countryCodes[Math.floor(Math.random() * countryCodes.length)];
    const number = Math.floor(Math.random() * 9000000000) + 1000000000; // Generate a random 10 digit number
    return `${countryCode}${number}`;
}

export const addDummyUsers = functions.https.onRequest(async (req, res) => {
    const batch = db.batch();
    const usersCollection = db.collection("users");
    const usersRefCollection = db.collection("usersRef");

    try {
        for (let i = 1; i <= 10; i++) {
            const userDocRef = usersCollection.doc();
            batch.set(userDocRef, {
                name: `testUser${i}`,
                // eslint-disable-next-line max-len
                imageUrl: "https://firebasestorage.googleapis.com/v0/b/its-urgent-adb83.appspot.com/o/userImages%2Fprofile.jpg?alt=media&token=5c5d6dab-9bbd-4f91-afe3-33ca6d69aa28",
                deviceToken: "0000",
            });

            const phoneNumber = generateRandomPhoneNumber();
            console.log("phoneNumber:", phoneNumber, " name: testUser" + i,
            );
            const userRefDocRef = usersRefCollection.doc(phoneNumber);
            batch.set(userRefDocRef, {
                uid: userDocRef.id,
            });
        }

        await batch.commit();
        logger.info("Dummy users and userRefs added successfully");
        res.status(200).send("Dummy users and userRefs added successfully");
    } catch (error) {
        logger.error("Error adding dummy users and userRefs:", error);
        res.status(500).send("Error adding dummy users and userRefs");
    }
});
