import admin from 'firebase-admin';
import * as dotenv from "dotenv";
dotenv.config();

admin.initializeApp({
	credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CONFIG)),
});

export default admin;