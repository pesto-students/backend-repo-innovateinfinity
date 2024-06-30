import * as Sentry from "@sentry/node";
import { getDriversByFilter } from '../services/DriverServices.js';
import { PROFILES } from "../utils/enums.js";

const checkDriver = async (req, res, next) => {

    try {
        const drivers = await getDriversByFilter({ phoneNumber: req.phoneNumber });

        if (drivers.length > 0 && drivers[0].profile === PROFILES.DRIVER) {
            req.user = drivers[0];
            return next();
        }

        return res.status(401).json({ msg: 'You are not authorized for this particular action.' });
    }
    catch {
        Sentry.captureException(e);
        return res.status(401).json({ msg: 'You are not authorized for this particular action.' });
    }
};

export default checkDriver;