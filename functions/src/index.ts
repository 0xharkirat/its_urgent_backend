/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import {helloWorld} from "./hello-world/restful/helloWorld";
import {createUserRef} from "./auth/reactive/createUserRef";
import {deleteUserRef} from "./auth/reactive/deleteUserRef";
import { addDummyUsers } from "./auth/restful/addDummyUsers";
import {testFunction} from "./notification/restful/test";
import { sendNotification } from "./notification/restful/sendNotification";


export { helloWorld, createUserRef, deleteUserRef, addDummyUsers, testFunction, sendNotification};

