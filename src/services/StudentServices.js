import Student from "../models/Student.js";

export const createStudent = async (data) => {
    const student = await Student.create({ ...data });
    return student;
}

export const getStudentsByFilter = async (filter) => {
    const students = await Student.find(filter);
    return students;
}

export const getStudentsDetailsByFilter = async (filter) => {
    const students = await Student.find(filter).populate("organizationId").exec();
    return students;
}

export const updateStudentByFilter = async (filter, data, updatedDocCondition) => {
    const student = await Student.findOneAndUpdate(filter, data, updatedDocCondition);
    return student;
}

export const deleteStudentByFilter = async (filter) => {
    const student = await Student.findOneAndDelete(filter);
    return student;
}
