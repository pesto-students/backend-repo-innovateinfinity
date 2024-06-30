import Express from "express";
import { body, check, param, query } from "express-validator";
import { endOfDay, startOfDay } from "date-fns";
import {
  createExpense,
  getExpensesByFilter,
  updateExpenseByFilter,
} from "../services/ExpenseServices.js";
import {
  createAttendance,
  getAttendancesByFilter,
  deleteAttendanceByFilter,
  updateAttendanceByFilter,
  getAttendanceDetailsByFilter,
} from "../services/AttendanceServices.js";
import checkDriver from "../middlewares/checkDriver.js";
import auth from "../middlewares/auth.js";
import rejectBadRequests from "../utils/rejectBadRequests.js";
import {
  getStudentsByFilter,
  createStudent,
  updateStudentByFilter,
  getStudentsDetailsByFilter,
  deleteStudentByFilter
} from "../services/StudentServices.js";
import { STUDENT_STATUS } from "../utils/enums.js";

const Router = Express.Router();

//////////////////////////////////// Expense endpoints start ////////////////////////////////////

/**
 * get expenses
 */

Router.get("/expense", auth, checkDriver, async (req, res) => {
  try {
    const condition = {
      organizationId: req.user.organizationId,
    };
    const expenses = await getExpensesByFilter(condition);
    return res
      .status(200)
      .json({ success: true, message: "Expense list.", data: expenses });
  } catch (err) {
    console.log("error while getting expense list.");
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, error: err.message, message: "server error" });
  }
});

/**
 * update expense
 */

const updateExpenseBodyValidator = [
  body("type")
    .notEmpty()
    .withMessage("Type field is required")
    .isString()
    .withMessage("Type must be a string."),
  body("amount")
    .notEmpty()
    .withMessage("Amount field is required")
    .isInt()
    .withMessage("Amount must be a Integer."),
  param("expenseId")
    .notEmpty()
    .withMessage("expenseId field is required")
    .isString()
    .withMessage("expenseId must be a string."),
];

Router.patch(
  "/expense/:expenseId",
  auth,
  checkDriver,
  updateExpenseBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      await updateExpenseByFilter({ _id: req.params.expenseId }, req.body, {
        new: true,
      });
      return res
        .status(200)
        .json({ success: true, message: "Expense updated succesfully." });
    } catch (err) {
      console.log("error while updating expense.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * register expense
 */

const createExpenseBodyValidator = [
  body("type")
    .notEmpty()
    .withMessage("Type field is required")
    .isString()
    .withMessage("Type must be a string."),
  body("amount")
    .notEmpty()
    .withMessage("Amount field is required")
    .isInt()
    .withMessage("Amount must be a Integer."),
];

Router.post(
  "/expense",
  auth,
  checkDriver,
  createExpenseBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const data = {
        ...req.body,
        driverId: req.user._id,
        organizationId: req.user.organizationId,
      };
      await createExpense(data);
      return res
        .status(200)
        .json({ success: true, message: "Expense recorded succesfully." });
    } catch (err) {
      console.log("error while recording expense.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

//////////////////////////////////// Expense endpoints end ////////////////////////////////////

//////////////////////////////////// Attendance endpoints start ////////////////////////////////////

/**
 * register Attendance
 */

const createAttendanceBodyValidator = [
  body("studentId")
    .notEmpty()
    .withMessage("Student Id field is required")
    .isString()
    .withMessage("Student Id must be a string."),
  body("kmDriven").isInt().withMessage("KM Driven must be a Integer."),
  body("status")
    .notEmpty()
    .withMessage("Status field is required")
    .isString()
    .withMessage("Status must be a String."),
  body("classType")
    .isString()
    .withMessage("classType must be a String."),
];

Router.post(
  "/attendance",
  auth,
  checkDriver,
  createAttendanceBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const data = {
        ...req.body,
        driverId: req.user._id,
      };
      await createAttendance(data);
      return res
        .status(200)
        .json({ success: true, message: "Attendance recorded succesfully." });
    } catch (err) {
      console.log("error while recording attendance.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * Get attendance for a student
 */

const getAttendanceParamsValidator = [
    query("studentId")
        .notEmpty()
        .withMessage("Student Id field is required")
        .isString()
        .withMessage("Student Id must be a string."),
];

Router.get(
  "/attendance",
  auth,
  checkDriver,
  getAttendanceParamsValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const attendance = await getAttendancesByFilter({
        studentId: req.query.studentId,
      });
      return res.status(200).json({
        success: true,
        message: "Attendance List for student- Driver.",
        data: attendance,
      });
    } catch (err) {
      console.log(
        "error while creating attendatnce for organization - Driver.."
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
  body("status").optional().isString().withMessage("Status must be a string."),
];

Router.patch(
  "/attendance/:attendanceId",
  auth,
  checkDriver,
  updateAttendanceValidator,
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
          "error occured while updating Attendance. Attendance not found OR update failed - Driver."
        );
        return res.status(404).json({
          success: false,
          error: "not found",
          message:
            "Attendance not found OR update failed. Please contact admin if issue persists - Driver.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Attendance updated succesfully - Driver.",
      });
    } catch (err) {
      console.log(
        "error while updating attendatnce for organization - Driver."
      );
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

const deleteAttendanceValidator = [
  param("attendanceId")
    .notEmpty()
    .withMessage("Attendance Id field is required")
    .isString()
    .withMessage("Attendance Id field must be a string."),
];

Router.delete(
  "/attendance/:attendanceId",
  auth,
  checkDriver,
  deleteAttendanceValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      await deleteAttendanceByFilter({ _id: req.params.attendanceId });
      return res.status(200).json({
        success: true,
        message: "Attendance Deleted succesfully - Driver.",
      });
    } catch (err) {
      console.log(
        "error while deleting attendatnce for organization - Driver."
      );
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

//////////////////////////////////// Attendance endpoints end ////////////////////////////////////

//////////////////////////////////// Students endpoints start ////////////////////////////////////

/**
 * Get List of students
 */

const getStudentValidator = [
  query("status").optional().isString().withMessage("Status must be a string."),
];

Router.get(
  "/student",
  auth,
  checkDriver,
  getStudentValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      let condition = {
        organizationId: req.user.organizationId,
      };
      if (req.query.status !== undefined && req.query.status !== null) {
        condition = { ...condition, status: req.query.status };
      }
      let attendance = [];
      const students = await getStudentsByFilter(condition);
      if (req.query.status === STUDENT_STATUS.INPROGRESS) {
        const studentIds = students.map((d) => d._id.toString());
        const attendanceCondition = {
          studentId: { $in: studentIds },
          createdAt: {
            $gte: startOfDay(new Date()),
            $lte: endOfDay(new Date()),
          },
        };
        attendance = await getAttendanceDetailsByFilter(attendanceCondition);
      }
      return res.status(200).json({
        success: true,
        message: "Students list.",
        data: students,
        attendance: attendance,
      });
    } catch (err) {
      console.log("error while getting active students.");
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
]

Router.get("/student/:studentId", auth, checkDriver, getStudentByIdParamValidator, rejectBadRequests, async (req, res) => {
    try {
        let condition = {
            organizationId: req.user.organizationId,
          };

        if (req.params.studentId !== undefined && req.params.studentId !== null) {
            condition = { _id: req.params.studentId }
        }

        const student = await getStudentsDetailsByFilter(condition);

        return res.status(200).json({ success: true, message: "Students details - Driver.", data: student });

    } catch (err) {
        console.log("error while getting student by Id - Driver.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});



/**
 * create a student
 */

const createStudentBodyValidator = [
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
  "/student",
  auth,
  checkDriver,
  createStudentBodyValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      const data = {
        ...req.body,
        driverId: req.user._id,
        status: STUDENT_STATUS.INPROGRESS,
        organizationId: req.user.organizationId,
      };
      await createStudent(data);
      return res
        .status(200)
        .json({ success: true, message: "Student Created succesfully." });
    } catch (err) {
      console.log("error while creating student.");
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
];

Router.patch(
  "/student/:studentId",
  auth,
  checkDriver,
  updateStudentValidators,
  rejectBadRequests,
  async (req, res) => {
    try {
      // TODO add condition for checking organization for driver an student
      const user = await updateStudentByFilter(
        { _id: req.params.studentId },
        req.body,
        { new: true }
      );
      if (user == null) {
        console.log(
          "error occured while updating Student. Student not found OR update failed - Driver."
        );
        return res.status(404).json({
          success: false,
          error: "not found",
          message:
            "Student not found OR update failed. Please contact admin if issue persists - Driver.",
        });
      }
      return res.status(200).json({
        success: true,
        message: "Student updated succesfully - Driver.",
      });
    } catch (err) {
      console.log("error while updating student for organization - Driver.");
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
]

Router.delete("/student/:studentId", auth, checkDriver, deleteStudentBodyValidator, rejectBadRequests, async (req, res) => {

    try {
        await deleteStudentByFilter({ _id: req.params.studentId, organizationId: req.user.organizationId });
        return res.status(200).json({ success: true, message: "Student Deleted succesfully." });

    } catch (err) {
        console.log("error while deleting student for Driver.");
        console.log(err.message);
        return res.status(500).json({ success: false, error: err.message, message: "server error" });
    }
});

//////////////////////////////////// Students endpoints end ////////////////////////////////////

export default Router;
