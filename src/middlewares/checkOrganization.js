import { getOrganizationsByFilter } from '../services/OrganizationServices.js';
import { PROFILES } from "../utils/enums.js";

const checkOrganization = async (req, res, next) => {

    try {
        const orgs = await getOrganizationsByFilter({ phoneNumber: req.phoneNumber, active: true });

        if (orgs.length > 0 && orgs[0].profile === PROFILES.ORGANIZATION) {
            req.user = orgs[0];
            return next();
        }
        return res.status(401).json({ msg: 'You are not authorized for this particular action.' });

    }
    catch {
        return res.status(401).json({ msg: 'You are not authorized for this particular action.' });
    }

};

export default checkOrganization;