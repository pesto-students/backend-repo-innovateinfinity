import Attendance from "../models/Attendance.js";

export const createAttendance = async (data) => {
    const attendance = await Attendance.create({ ...data });
    return attendance;
}

export const getAttendancesByFilter = async (filter) => {
    const attendanceResult = await Attendance.find(filter);
    return attendanceResult;
}

export const getAttendanceDetailsByFilter = async (filter) => {
    const attendanceResult = await Attendance.find(filter).populate("driverId").exec();
    return attendanceResult;
}

export const updateAttendanceByFilter = async (filter, data, updatedDocCondition) => {
    const attendance = await Attendance.findOneAndUpdate(filter, data, updatedDocCondition);
    return attendance;
}

export const deleteAttendanceByFilter = async (filter) => {
    const attendance = await Attendance.findOneAndDelete(filter);
    return attendance;
}
