import * as Sentry from "@sentry/node";
import admin from '../config/firebase-config.js';

const auth = async (req, res, next) => {
    // get token from header
    const token = req.header("x-auth-token");

    // check if not token
    if (!token) {
        return res
            .status(401)
            .json({ msg: "no token found, authorization denied" });
    }

    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (decodeValue) {
            const numberVar = decodeValue.phone_number;
            req.phoneNumber = parseInt(numberVar.substring(numberVar.length - 10, numberVar.length));
            return next();
        }
        return res.status(401).json({ msg: 'Unauthorized' });
    } catch (e) {
        Sentry.captureException(e);
        return res.status(401).json({ msg: 'Unauthorized' });
    }
};

export default auth;