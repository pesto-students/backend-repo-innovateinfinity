import Admin from "../models/Admin.js";

export const getAdminsByFilter = async (filter) => {
    const admin = await Admin.find(filter);
    return admin;
}

export const createAdmin = async (data) => {
    const admin = await Admin.create({ ...data });
    return admin;
}


export const deleteAdminByFilter = async (filter) => {
    const admin = await Admin.findOneAndDelete(filter);
    return admin;
}
