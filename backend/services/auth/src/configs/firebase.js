import { cert, initializeApp } from "firebase-admin/app";
import { ENV } from "./env";




export const app = initializeApp({
  credential: cert({
    projectId: ENV.FIREBASE_PROJECT_ID,
    clientEmail: ENV.FIREBASE_CLIENT_EMAIL,
    privateKey: ENV.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});