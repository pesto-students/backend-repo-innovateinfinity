import Driver from "../models/Driver.js";

export const createDriver = async (data) => {
    const driver = await Driver.create({ ...data });
    return driver;
}

export const getDriversByFilter = async (filter) => {
    const drivers = await Driver.find(filter);
    return drivers;
}

export const getDriverDetailsByFilter = async (filter) => {
    const students = await Driver.find(filter).populate("organizationId").exec();
    return students;
}

export const updateDriverByFilter = async (filter, data, updatedDocCondition) => {
    const driver = await Driver.findOneAndUpdate(filter, data, updatedDocCondition);
    return driver;
}

export const deleteDriverByFilter = async (filter) => {
    const driver = await Driver.findOneAndDelete(filter);
    return driver;
}
