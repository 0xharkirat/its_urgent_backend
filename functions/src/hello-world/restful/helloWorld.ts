

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";


export const helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", {structuredData: true});
    response.send(`<h1>Hello from 0xharkirat (Harkirat Singh).</h1>
      <footer>Thanks for visiting. A 0xharkirat (Harkirat Singh) production.</footer>`);
  });
  