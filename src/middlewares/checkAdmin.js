import * as Sentry from "@sentry/node";
import { getAdminsByFilter } from '../services/AdminServices.js';
import { PROFILES } from "../utils/enums.js";

const checkAdmin = async (req, res, next) => {

    try {
        const admins = await getAdminsByFilter({ phoneNumber: req.phoneNumber, disabled : false });

        if (admins.length > 0 && admins[0].profile === PROFILES.ADMIN) {
            req.user = admins[0];
            return next();
        }
        return res.status(401).json({ msg: 'You are not authorized for this particular action.' });

    }
    catch {
        Sentry.captureException(e);
        return res.status(401).json({ msg: 'You are not authorized for this particular action.' });
    }

};

export default checkAdmin;