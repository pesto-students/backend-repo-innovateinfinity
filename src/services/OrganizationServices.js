import Organization from "../models/Organization.js";

export const createOrganization = async (data) => {
    const organization = await Organization.create({ ...data });
    return organization;
}

export const getOrganizationsByFilter = async (filter) => {
    const organizations = await Organization.find(filter);
    return organizations;
}

export const updateOrganizationByFilter = async (filter, data, updatedDocCondition) => {
    const organization = await Organization.findOneAndUpdate(filter, data, updatedDocCondition);
    return organization;
}

export const deleteOrganizationByFilter = async (filter) => {
    const organization = await Organization.findOneAndDelete(filter);
    return organization;
}
