import * as functions from "firebase-functions";
// import admin from "../../core/admin";
import * as logger from "firebase-functions/logger";


// create a test callable function from flutter client
export const testFunction = functions.https.onCall(async (data, context) => {
    logger.info("Test function called", {structuredData: true});
    return {message: "Test function called successfully"};
});
