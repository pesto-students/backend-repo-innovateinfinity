import Express from "express";
import * as dotenv from "dotenv";
import { body, param, query } from "express-validator";
import auth from "../middlewares/auth.js";
import checkAdmin from "../middlewares/checkAdmin.js";
import rejectBadRequests from "../utils/rejectBadRequests.js";
import {
  deleteAttendanceByFilter,
  getAttendanceDetailsByFilter,
  updateAttendanceByFilter,
} from "../services/AttendanceServices.js";
import {
  createStudent,
  updateStudentByFilter,
  deleteStudentByFilter,
  getStudentsDetailsByFilter,
} from "../services/StudentServices.js";
import {
  createDriver,
  updateDriverByFilter,
  deleteDriverByFilter,
  getDriverDetailsByFilter,
} from "../services/DriverServices.js";
import {
  createOrganization,
  getOrganizationsByFilter,
  updateOrganizationByFilter,
} from "../services/OrganizationServices.js";
import { getExpensesDetailsByFilter } from "../services/ExpenseServices.js";
import {
  getAdminsByFilter,
  deleteAdminByFilter,
  createAdmin,
} from "../services/AdminServices.js";
import { ORGANIZATION_JOINED_FROM } from "../utils/enums.js";

dotenv.config();

// TODO add condition to update only some fields, not all, wherever required.

const Router = Express.Router();

//////////////////////////////////// Admins endpoints start ////////////////////////////////////

/**
 * Get all Admins
 */

Router.get("/", auth, checkAdmin, async (req, res) => {
  try {
    const admins = await getAdminsByFilter({});
    return res
      .status(200)
      .json({ success: true, message: "admins List - Admin.", data: admins });
  } catch (err) {
    console.log("error while getting admins list - Admin.");
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, error: err.message, message: "server error" });
  }
});

/**
 * create admin
 */

const createAdminValidator = [
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
];

Router.post(
  "/",
  auth,
  checkAdmin,
  createAdminValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const data = {
        ...req.body,
      };

      if (req.query.pin && req.query.pin === process.env.ADMIN_PIN) {
        await createAdmin(data);

        return res.status(200).json({
          success: true,
          message: "admin Created succesfully - Admin.",
        });
      }

      return res.status(400).json({ success: false, message: "Wrong Pin." });
    } catch (err) {
      console.log("error while creating admin - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * Delete admin
 */

const deleteAdminValidator = [
  param("adminId")
    .notEmpty()
    .withMessage("Admin Id field is required")
    .isString()
    .withMessage("Admin Id must be a string."),
];

Router.delete(
  "/:adminId",
  auth,
  checkAdmin,
  deleteAdminValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      if (req.query.pin && req.query.pin === process.env.ADMIN_PIN) {
        await deleteAdminByFilter({ _id: req.params.adminId });
        return res.status(200).json({
          success: true,
          message: "Admin Deleted succesfully - Admin.",
        });
      }

      return res.status(400).json({ success: false, message: "Wrong Pin." });
    } catch (err) {
      console.log("error while deleting admin - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

//////////////////////////////////// Admins endpoints end ////////////////////////////////////

//////////////////////////////////// Organization endpoints start ////////////////////////////////////

/**
 * Get all organizations
 */

Router.get("/organization", auth, checkAdmin, async (req, res) => {
  try {
    let condition = {};

    if (req.query.approved !== undefined && req.query.approved !== null) {
      condition = { approved: req.query.approved };
    }

    if (req.query.joinedFrom !== undefined && req.query.joinedFrom !== null) {
      condition = { ...condition, joinedFrom: req.query.joinedFrom };
    }

    const drivers = await getOrganizationsByFilter(condition);
    return res.status(200).json({
      success: true,
      message: "Organizations List - Admin.",
      data: drivers,
    });
  } catch (err) {
    console.log("error while getting drivers list - Admin.");
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, error: err.message, message: "server error" });
  }
});

/**
 * Get organization by Id
 */

const getOrganizationByIdParamsValidator = [
  param("organizationId")
    .notEmpty()
    .withMessage("Organization Id is required.")
    .isString()
    .withMessage("Organization Id must be a string."),
];

Router.get(
  "/organization/:organizationId",
  auth,
  checkAdmin,
  getOrganizationByIdParamsValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      let condition = {};

      if (
        req.params.organizationId !== undefined &&
        req.params.organizationId !== null
      ) {
        condition = { _id: req.params.organizationId };
      }

      const drivers = await getOrganizationsByFilter(condition);
      return res.status(200).json({
        success: true,
        message: "Organizations Details - Admin.",
        data: drivers,
      });
    } catch (err) {
      console.log("error while getting Organization Details - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

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
];

Router.post(
  "/organization",
  auth,
  checkAdmin,
  createOrganizationBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const { profile, ...data } = req.body;

      await createOrganization({
        ...data,
        joinedFrom: ORGANIZATION_JOINED_FROM.ADMIN_DASHBOARD,
        approvedById: req.user._id,
        approved: true,
        active: false,
      });

      return res.status(200).json({
        success: true,
        message: "Organization Created succesfully - Admin.",
      });
      // TODO create a payment object for free trial
    } catch (err) {
      console.log(
        "error while creating organization while signing up - Admin."
      );
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * update Organization
 */

// TODO
const updateOrganizationBodyValidator = [
  param("organizationId")
    .notEmpty()
    .withMessage("Organization Id field is required")
    .isString()
    .withMessage("Organization Id must be a string."),
  // body("address")
  //     .isString()
  //     .withMessage("Address must be a string."),
  // body("pincode")
  //     .isInt()
  //     .withMessage("Pincode must be a Integer."),
  // body("state")
  //     .isString()
  //     .withMessage("State must be a string."),
];

Router.patch(
  "/organization/:organizationId",
  auth,
  checkAdmin,
  updateOrganizationBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const organization = await updateOrganizationByFilter(
        { _id: req.params.organizationId },
        req.body,
        { new: true }
      );

      if (organization == null) {
        console.log(
          "error occured while updating Organization. Organization not found OR update failed - Admin."
        );
        return res.status(404).json({
          success: false,
          error: "not found",
          message:
            "Organization not found OR update failed. Please contact admin if issue persists. - Admin.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Organization updated succesfully.",
        data: organization,
      });
    } catch (err) {
      console.log("error while updating organization.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

//////////////////////////////////// Organization endpoints end ////////////////////////////////////

//////////////////////////////////// Driver endpoints start ////////////////////////////////////

/**
 * Get all drivers
 */

const getDriverQueryValidator = [
  query("organizationId")
    .optional()
    .isString()
    .withMessage("Organization Id must be a string."),
];

Router.get(
  "/driver",
  auth,
  checkAdmin,
  getDriverQueryValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      let condition = {};

      if (
        req.query.organizationId !== undefined &&
        req.query.organizationId !== null
      ) {
        condition = { organizationId: req.query.organizationId };
      }

      const drivers = await getDriverDetailsByFilter(condition);
      return res.status(200).json({
        success: true,
        message: "Drivers List - Admin.",
        data: drivers,
      });
    } catch (err) {
      console.log("error while getting drivers list - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * Get driver by id
 */

const getDriverByIdParamsValidator = [
  param("driverId")
    .notEmpty()
    .withMessage("Driver Id is required.")
    .isString()
    .withMessage("Driver Id must be a string."),
];

Router.get(
  "/driver/:driverId",
  auth,
  checkAdmin,
  getDriverByIdParamsValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      let condition = { _id: req.params.driverId };

      // if (req.params.driverId !== undefined && req.params.driverId !== null) {
      //     condition = { _id: req.params.driverId }
      // }

      const drivers = await getDriverDetailsByFilter(condition);
      return res.status(200).json({
        success: true,
        message: "Drivers details - Admin.",
        data: drivers,
      });
    } catch (err) {
      console.log("error while getting drivers details - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * create Driver
 */

const createDriverBodyValidator = [
  body("organizationId")
    .optional()
    .isString()
    .withMessage("Organization Id must be a string."),
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
];

Router.post(
  "/driver",
  auth,
  checkAdmin,
  createDriverBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const data = {
        ...req.body,
      };

      await createDriver(data);

      return res.status(200).json({
        success: true,
        message: "Driver Created succesfully - Admin.",
      });
    } catch (err) {
      console.log("error while creating driver for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * update Driver
 */

const updateDriverBodyValidator = [
  param("driverId")
    .notEmpty()
    .withMessage("Driver Id field is required")
    .isString()
    .withMessage("Driver Id must be a string."),
  body("name").optional().isString().withMessage("Name must be a string."),
  body("phoneNumber")
    .optional()
    .isInt()
    .withMessage("Phone Number must be a Integer."),
  body("organizationId")
    .optional()
    .isString()
    .withMessage("Organization Id must be a string."),
];

Router.patch(
  "/driver/:driverId",
  auth,
  checkAdmin,
  updateDriverBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const user = await updateDriverByFilter(
        { _id: req.params.driverId },
        req.body,
        { new: true }
      );

      if (user == null) {
        console.log(
          "error occured while updating Driver. Driver not found OR update failed - Admin."
        );
        return res.status(404).json({
          success: false,
          error: "not found",
          message:
            "Driver not found OR update failed. Please contact admin if issue persists - Admin.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Driver updated succesfully - Admin.",
      });
    } catch (err) {
      console.log("error while updating driver for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * Delete Driver
 */

const deleteDriverBodyValidator = [
  param("driverId")
    .notEmpty()
    .withMessage("Driver Id field is required")
    .isString()
    .withMessage("Driver Id must be a string."),
];

Router.delete(
  "/driver/:driverId",
  auth,
  checkAdmin,
  deleteDriverBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      await deleteDriverByFilter({ _id: req.params.driverId });
      return res.status(200).json({
        success: true,
        message: "Driver Deleted succesfully - Admin.",
      });
    } catch (err) {
      console.log("error while deleting driver for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

//////////////////////////////////// Driver endpoints end ////////////////////////////////////

//////////////////////////////////// Student endpoints start ////////////////////////////////////

/**
 * Get all Students
 */

const getStudentsQueryValidator = [
  query("organizationId")
    .optional()
    .isString()
    .withMessage("Organization Id must be a string."),
];

Router.get(
  "/student",
  auth,
  checkAdmin,
  getStudentsQueryValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      let condition = {};

      if (
        req.query.organizationId !== undefined &&
        req.query.organizationId !== null
      ) {
        condition = { organizationId: req.query.organizationId };
      }

      const students = await getStudentsDetailsByFilter(condition);

      return res.status(200).json({
        success: true,
        message: "Students List - Admin.",
        data: students,
      });
    } catch (err) {
      console.log("error while getting students for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * Get student by id
 */

const getStudentByIdParamValidator = [
  param("studentId")
    .notEmpty()
    .withMessage("Student Id is required.")
    .isString()
    .withMessage("Student Id must be a string."),
];

Router.get(
  "/student/:studentId",
  auth,
  checkAdmin,
  getStudentByIdParamValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      let condition = {};

      if (req.params.studentId !== undefined && req.params.studentId !== null) {
        condition = { _id: req.params.studentId };
      }

      const student = await getStudentsDetailsByFilter(condition);

      return res.status(200).json({
        success: true,
        message: "Students details - Admin.",
        data: student,
      });
    } catch (err) {
      console.log("error while getting student by Id - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * create Student
 */

const createStudentBodyValidator = [
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
  body("organizationId")
    .optional()
    .isString()
    .withMessage("Organization Id must be a string."),
];

Router.post(
  "/student",
  auth,
  checkAdmin,
  createStudentBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const data = {
        ...req.body,
      };

      await createStudent(data);

      return res.status(200).json({
        success: true,
        message: "Student Created succesfully - Admin.",
      });
    } catch (err) {
      console.log("error while creating student for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * update Student
 */

const updateStudentValidators = [
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
  body("organizationId")
    .optional()
    .isString()
    .withMessage("Organization Id must be a string."),
];

Router.patch(
  "/student/:studentId",
  auth,
  checkAdmin,
  updateStudentValidators,
  rejectBadRequests,
  async (req, res) => {
    try {
      const user = await updateStudentByFilter(
        { _id: req.params.studentId },
        req.body,
        { new: true }
      );

      if (user == null) {
        console.log(
          "error occured while updating Student. Student not found OR update failed - Admin."
        );
        return res.status(404).json({
          success: false,
          error: "not found",
          message:
            "Student not found OR update failed. Please contact admin if issue persists - Admin.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Student updated succesfully - Admin.",
      });
    } catch (err) {
      console.log("error while updating student for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * Delete Student
 */

const deleteStudentBodyValidator = [
  param("studentId")
    .notEmpty()
    .withMessage("Student Id field is required")
    .isString()
    .withMessage("Student Id must be a string."),
];

Router.delete(
  "/student/:studentId",
  auth,
  checkAdmin,
  deleteStudentBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      await deleteStudentByFilter({ _id: req.params.studentId });
      return res.status(200).json({
        success: true,
        message: "Student Deleted succesfully - Admin.",
      });
    } catch (err) {
      console.log("error while deleting student for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

//////////////////////////////////// Student endpoints end ////////////////////////////////////

//////////////////////////////////// Attendance endpoints start ////////////////////////////////////

/**
 * Get attendance for a student
 */

const getAttendanceQueryValidator = [
  query("studentId")
    .notEmpty()
    .withMessage("Student Id field is required")
    .isString()
    .withMessage("Student Id must be a string."),
];

Router.get(
  "/attendance",
  auth,
  checkAdmin,
  getAttendanceQueryValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const attendance = await getAttendanceDetailsByFilter({
        studentId: req.query.studentId,
      });
      return res.status(200).json({
        success: true,
        message: "Attendance List - Admin.",
        data: attendance,
      });
    } catch (err) {
      console.log(
        "error while creating attendatnce for organization - Admin.."
      );
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * update attendance for a student
 */

const updateAttendanceBodyValidator = [
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
];

Router.patch(
  "/attendance/:attendanceId",
  auth,
  checkAdmin,
  updateAttendanceBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const attendance = await updateAttendanceByFilter(
        { _id: req.params.attendanceId },
        req.body,
        { new: true }
      );

      if (attendance == null) {
        console.log(
          "error occured while updating Attendance. Attendance not found OR update failed - Admin.."
        );
        return res.status(404).json({
          success: false,
          error: "not found",
          message:
            "Attendance not found OR update failed. Please contact admin if issue persists - Admin.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Attendance updated succesfully - Admin.",
      });
    } catch (err) {
      console.log("error while updating attendatnce for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * delete attendance
 */

const deleteAttendanceParamsValidator = [
  param("attendanceId")
    .notEmpty()
    .withMessage("Attendance Id field is required")
    .isString()
    .withMessage("Attendance Id field must be a string."),
];

Router.delete(
  "/attendance/:attendanceId",
  auth,
  checkAdmin,
  deleteAttendanceParamsValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      await deleteAttendanceByFilter({ _id: req.params.attendanceId });
      return res.status(200).json({
        success: true,
        message: "Attendance Deleted succesfully - Admin.",
      });
    } catch (err) {
      console.log("error while deleting attendatnce for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

//////////////////////////////////// Attendance endpoints end ////////////////////////////////////

//////////////////////////////////// Expenses endpoints start ////////////////////////////////////

/**
 * Get all Expenses for a organization
 */

const getExpensesQueryValidator = [
  query("organizationId")
    .notEmpty()
    .withMessage("Organization Id is required.")
    .isString()
    .withMessage("Organization Id must be a string."),
];

Router.get(
  "/expense",
  auth,
  checkAdmin,
  getExpensesQueryValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      let condition = {};

      if (
        req.query.organizationId !== undefined &&
        req.query.organizationId !== null
      ) {
        condition = { organizationId: req.query.organizationId };
      }

      const expenses = await getExpensesDetailsByFilter(condition);

      return res.status(200).json({
        success: true,
        message: "Expenses List for org - Admin.",
        data: expenses,
      });
    } catch (err) {
      console.log("error while getting expenses for organization - Admin.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

//////////////////////////////////// Expenses endpoints end ////////////////////////////////////

export default Router;
