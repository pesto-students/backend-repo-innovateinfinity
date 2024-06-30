import Express from 'express';
import { body, param, query } from "express-validator";
import auth from "../middlewares/auth.js";
import checkOrganization from "../middlewares/checkOrganization.js";
import { deleteAttendanceByFilter, getAttendancesByFilter, updateAttendanceByFilter, getAttendanceDetailsByFilter } from '../services/AttendanceServices.js';
import { getStudentsByFilter, createStudent, updateStudentByFilter, deleteStudentByFilter, getStudentsDetailsByFilter } from '../services/StudentServices.js';
import { getDriversByFilter, createDriver, updateDriverByFilter, deleteDriverByFilter, getDriverDetailsByFilter } from '../services/DriverServices.js';
import rejectBadRequests from "../utils/rejectBadRequests.js";
import { ORGANIZATION_JOINED_FROM } from "../utils/enums.js";
import { createOrganization, updateOrganizationByFilter } from '../services/OrganizationServices.js';

// TODO add condition to update only some fields, not all, wherever required.

const Router = Express.Router();


//////////////////////////////////// Organization endpoints start ////////////////////////////////////

/**
 * create Organization
 */

const createOrganizationBodyValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name field is required")
        .isString()
        .withMessage("Name must be a string."),
    body("phoneNumber")
        .notEmpty()
        .withMessage("Phone Number field is required")
        .isInt()
        .withMessage("Phone Number must be a Integer."),
    body("address")
        .notEmpty()
        .withMessage("Address field is required")
        .isString()
        .withMessage("Address must be a string."),
    body("pincode")
        .notEmpty()
        .withMessage("Pincode field is required")
        .isInt()
        .withMessage("Pincode must be a Integer."),
    body("city")
        .notEmpty()
        .withMessage("City field is required")
        .isString()
        .withMessage("City must be a String."),
    body("state")
        .notEmpty()
        .withMessage("State field is required")
        .isString()
        .withMessage("State must be a string."),
    body("email")
        .optional()
        .isEmail()
        .withMessage("Email must be a email in format."),
]

Router.post("/", createOrganizationBodyValidator, rejectBadRequests, async (req, res) => {

    try {

        const { profile, ...data } = req.body;
        await createOrganization({ ...data, joinedFrom: ORGANIZATION_JOINED_FROM.SIGNUP_PAGE, active: false, approved : false });

        return res.status(200).json({ success: true, message: "Organization Created succesfully." });
        // TODO create a payment object for free trial

    } catch (err) {
        console.log("error while creating organization while signing up.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * update Organization
 */

// TODO
const updateOrganizationBodyValidator = [
    // body("name")
    //     .isString()
    //     .withMessage("Name must be a string."),
    // body("address")
    //     .isString()
    //     .withMessage("Address must be a string."),
    // body("pincode")
    //     .isInt()
    //     .withMessage("Pincode must be a Integer."),
    // body("state")
    //     .isString()
    //     .withMessage("State must be a string."),
]

Router.patch("/", auth, updateOrganizationBodyValidator, rejectBadRequests, async (req, res) => {

    try {

        const data = req.body

        const organization = await updateOrganizationByFilter({ _id: req.user._id }, data, { new: true });

        if (organization == null) {
            console.log("error occured while updating Organization. Organization not found OR update failed")
            return res.status(404).json({ success: false, error: "not found", message: "Organization not found OR update failed. Please contact admin if issue persists." });
        }

        return res.status(200).json({ success: true, message: "Organization updated succesfully.", data: organization });

    } catch (err) {
        console.log("error while updating organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

//////////////////////////////////// Organization endpoints end ////////////////////////////////////

//////////////////////////////////// Driver endpoints start ////////////////////////////////////

/**
 * Get all drivers
 */

Router.get("/driver", auth, checkOrganization, async (req, res) => {

    try {

        const drivers = await getDriversByFilter({ organizationId: req.user._id })

        return res.status(200).json({ success: true, message: "Drivers List.", data: drivers });

    } catch (err) {
        console.log("error while getting drivers list.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * Get driver by id
 */

const getDriverByIdParamsValidator = [
    param("driverId")
        .notEmpty()
        .withMessage("Driver Id is required.")
        .isString()
        .withMessage("Driver Id must be a string."),
]

Router.get("/driver/:driverId", auth, checkOrganization, getDriverByIdParamsValidator, rejectBadRequests, async (req, res) => {

    try {

        let condition = {
            _id: req.params.driverId,
            organizationId: req.user._id
        };

        const drivers = await getDriverDetailsByFilter(condition)
        return res.status(200).json({ success: true, message: "Drivers details - Admin.", data: drivers });

    } catch (err) {
        console.log("error while getting drivers details - Admin.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * create Driver
 */

const createDriverBodyValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name field is required")
        .isString()
        .withMessage("Name must be a string."),
    body("phoneNumber")
        .notEmpty()
        .withMessage("Phone Number field is required")
        .isInt()
        .withMessage("Phone Number must be a Integer."),
]

Router.post("/driver", auth, checkOrganization, createDriverBodyValidator, rejectBadRequests, async (req, res) => {

    try {

        const data = {
            ...req.body,
            organizationId: req.user._id,
        };

        await createDriver(data)

        return res.status(200).json({ success: true, message: "Driver Created succesfully." });

    } catch (err) {
        console.log("error while creating driver for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * update Driver
 */

const updateDriverValidator = [
    param("driverId")
        .notEmpty()
        .withMessage("Driver Id field is required")
        .isString()
        .withMessage("Driver Id must be a string."),
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string."),
    body("phoneNumber")
        .optional()
        .isInt()
        .withMessage("Phone Number must be a Integer."),
]

Router.patch("/driver/:driverId", auth, checkOrganization, updateDriverValidator, rejectBadRequests, async (req, res) => {

    try {

        const user = await updateDriverByFilter({ _id: req.params.driverId, organizationId: req.user._id }, req.body, { new: true });

        if (user == null) {
            console.log("error occured while updating Driver. Driver not found OR update failed")
            return res.status(404).json({ success: false, error: "not found", message: "Driver not found OR update failed. Please contact admin if issue persists." });
        }

        return res.status(200).json({ success: true, message: "Driver updated succesfully." });

    } catch (err) {
        console.log("error while updating driver for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * Delete Driver
 */

const deleteDriverValidator = [
    param("driverId")
        .notEmpty()
        .withMessage("Driver Id field is required")
        .isString()
        .withMessage("Driver Id must be a string."),
]

Router.delete("/driver/:driverId", auth, checkOrganization, deleteDriverValidator, rejectBadRequests, async (req, res) => {

    try {

        await deleteDriverByFilter({ _id: req.params.driverId, organizationId: req.user._id });
        return res.status(200).json({ success: true, message: "Driver Deleted succesfully." });

    } catch (err) {
        console.log("error while deleting driver for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

//////////////////////////////////// Driver endpoints end ////////////////////////////////////

//////////////////////////////////// Student endpoints start ////////////////////////////////////


/**
 * Get all Students
 */

Router.get("/student", auth, checkOrganization, async (req, res) => {
    try {
        const students = await getStudentsDetailsByFilter({ organizationId: req.user._id })

        return res.status(200).json({ success: true, message: "Students List.", data: students });

    } catch (err) {
        console.log("error while getting students for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * Get student by id
 */

const getStudentByIdParamValidator = [
    param("studentId")
        .notEmpty()
        .withMessage("Student Id is required.")
        .isString()
        .withMessage("Student Id must be a string."),
]

Router.get("/student/:studentId", auth, checkOrganization, getStudentByIdParamValidator, rejectBadRequests, async (req, res) => {
    try {
        let condition = {};

        if (req.params.studentId !== undefined && req.params.studentId !== null) {
            condition = { _id: req.params.studentId }
        }

        const student = await getStudentsDetailsByFilter(condition);

        return res.status(200).json({ success: true, message: "Students details - Admin.", data: student });

    } catch (err) {
        console.log("error while getting student by Id - Admin.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});


/**
 * create Student
 */

const createStudentBodyValidator = [
    // // driver id can be added later.
    // body("driverId")
    //     .optional()
    //     .isString()
    //     .withMessage("Driver Id must be a string."),
    body("name")
        .notEmpty()
        .withMessage("Name field is required")
        .isString()
        .withMessage("Name must be a string."),
    body("phoneNumber")
        .notEmpty()
        .withMessage("Phone Number field is required")
        .isInt()
        .withMessage("Phone Number must be a Integer."),
]

Router.post("/student", auth, checkOrganization, createStudentBodyValidator, rejectBadRequests, async (req, res) => {

    try {

        const data = {
            ...req.body,
            organizationId: req.user._id,
        };

        await createStudent(data)

        return res.status(200).json({ success: true, message: "Student Created succesfully." });

    } catch (err) {
        console.log("error while creating student for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * update Student
 */

const updateStudentBodyValidator = [
    param("studentId")
        .notEmpty()
        .withMessage("Student Id field is required")
        .isString()
        .withMessage("Student Id field must be a string."),
    body("name")
        .optional()
        .isString()
        .withMessage("Name field must be a string."),
    // body("driverId")
    //     .optional()
    //     .isString()
    //     .withMessage("Driver field Id must be a string."),
    body("status")
        .optional()
        .isString()
        .withMessage("Status field must be a string."),
    body("disabled")
        .optional()
        .isBoolean()
        .withMessage("Disabled field must be a boolean."),
]

Router.patch("/student/:studentId", auth, checkOrganization, updateStudentBodyValidator, rejectBadRequests, async (req, res) => {

    try {

        const user = await updateStudentByFilter({ _id: req.params.studentId, organizationId: req.user._id }, req.body, { new: true });

        if (user == null) {
            console.log("error occured while updating Student. Student not found OR update failed")
            return res.status(404).json({ success: false, error: "not found", message: "Student not found OR update failed. Please contact admin if issue persists." });
        }

        return res.status(200).json({ success: true, message: "Student updated succesfully." });

    } catch (err) {
        console.log("error while updating student for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * Delete Student
 */

const deleteStudentBodyValidator = [
    param("studentId")
        .notEmpty()
        .withMessage("Student Id field is required")
        .isString()
        .withMessage("Student Id must be a string."),
]

Router.delete("/student/:studentId", auth, checkOrganization, deleteStudentBodyValidator, rejectBadRequests, async (req, res) => {

    try {

        await deleteStudentByFilter({ _id: req.params.studentId, organizationId: req.user._id });
        return res.status(200).json({ success: true, message: "Student Deleted succesfully." });

    } catch (err) {
        console.log("error while deleting student for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

//////////////////////////////////// Student endpoints end ////////////////////////////////////

//////////////////////////////////// Attendance endpoints start ////////////////////////////////////

/**
 * Get attendance for a student
 */

const getAttendanceValidator = [
    query("studentId")
        .notEmpty()
        .withMessage("Student Id field is required")
        .isString()
        .withMessage("Student Id must be a string."),
]

Router.get("/attendance", auth, checkOrganization, getAttendanceValidator, rejectBadRequests, async (req, res) => {

    try {


        const students = await getStudentsByFilter({ _id: req.query.studentId, organizationId: req.user._id })

        if (students.length <= 0) {
            console.log("student for this attendance record doesn't exist for organization.")
            return res.status(404).json({ success: false, error: "student for this attendance record doesn't exist for organization.", message: "student for this attendance record doesn't exist for organization." });
        }

        if (students[0].organizationId.valueOf() !== req.user._id.valueOf()) {
            console.log("error occured while fetching student attendance for organization. organization to student mapping doesn't exist.")
            return res.status(400).json({ success: false, error: "student-organization mapping not found.", message: "Student for this attendance record doesn't belong to your organization." });
        }

        const attendance = await getAttendanceDetailsByFilter({ studentId: req.query.studentId })

        return res.status(200).json({ success: true, message: "Attendance List.", data: attendance });

    } catch (err) {
        console.log("error while creating attendatnce for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * update attendance for a student
 */

const updateAttendanceValidator = [
    param("attendanceId")
        .notEmpty()
        .withMessage("Attendance Id field is required")
        .isString()
        .withMessage("Attendance Id field must be a string."),
    body("kmDriven")
        .optional()
        .isInt()
        .withMessage("KM Driven must be a Integer."),
    body("startingMeter")
        .optional()
        .isInt()
        .withMessage("Starting Km must be a Integer."),
    body("endingMeter")
        .optional()
        .isInt()
        .withMessage("Ending Km must be a Integer."),
]

Router.patch("/attendance/:attendanceId", auth, checkOrganization, updateAttendanceValidator, rejectBadRequests, async (req, res) => {

    try {

        const attendanceRecords = await getAttendancesByFilter({ _id: req.params.attendanceId })

        if (attendanceRecords.length <= 0) {
            console.log("Attendance record doesn't exist.")
            return res.status(404).json({ success: false, error: "Attendance record not found for organization.", message: "Attendance record not found for organization." });
        }

        const students = await getStudentsByFilter({ _id: attendanceRecords[0].studentId, organizationId: req.user._id })

        if (students.length <= 0) {
            console.log("student for this attendance record doesn't exist for organization.")
            return res.status(404).json({ success: false, error: "student for this attendance record doesn't exist for organization.", message: "student for this attendance record doesn't exist for organization." });
        }

        if (students[0].organizationId.valueOf() !== req.user._id.valueOf()) {
            console.log("error occured while fetching student attendance for organization. organization to student mapping doesn't exist.")
            return res.status(400).json({ success: false, error: "student-organization mapping not found.", message: "Student for this attendance record doesn't belong to your organization." });
        }

        const attendance = await updateAttendanceByFilter({ _id: req.params.attendanceId }, req.body, { new: true });

        if (attendance == null) {
            console.log("error occured while updating Attendance. Attendance not found OR update failed")
            return res.status(404).json({ success: false, error: "not found", message: "Attendance not found OR update failed. Please contact admin if issue persists." });
        }

        return res.status(200).json({ success: true, message: "Attendance updated succesfully." });


    } catch (err) {
        console.log("error while updating attendatnce for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

/**
 * delete attendance
 */

const deleteAttendanceValidator = [
    param("attendanceId")
        .notEmpty()
        .withMessage("Attendance Id field is required")
        .isString()
        .withMessage("Attendance Id field must be a string."),
]

Router.delete("/attendance/:attendanceId", auth, checkOrganization, deleteAttendanceValidator, rejectBadRequests, async (req, res) => {

    try {

        const attendanceRecords = await getAttendancesByFilter({ _id: req.params.attendanceId })

        if (attendanceRecords.length <= 0) {
            console.log("Attendance record doesn't exist.")
            return res.status(404).json({ success: false, error: "Attendance record not found for organization.", message: "Attendance record not found for organization." });
        }

        const students = await getStudentsByFilter({ _id: attendanceRecords[0].studentId, organizationId: req.user._id })

        if (students.length <= 0) {
            console.log("student for this attendance record doesn't exist for organization.")
            return res.status(404).json({ success: false, error: "student for this attendance record doesn't exist for organization.", message: "student for this attendance record doesn't exist for organization." });
        }

        if (students[0].organizationId.valueOf() !== req.user._id.valueOf()) {
            console.log("error occured while fetching student attendance for organization. organization to student mapping doesn't exist.")
            return res.status(400).json({ success: false, error: "student-organization mapping not found.", message: "Student for this attendance record doesn't belong to your organization." });
        }

        await deleteAttendanceByFilter({ _id: req.params.attendanceId });
        return res.status(200).json({ success: true, message: "Attendance Deleted succesfully." });

    } catch (err) {
        console.log("error while deleting attendance for organization.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

//////////////////////////////////// Attendance endpoints end ////////////////////////////////////




export default Router;