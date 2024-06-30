import Express from "express";
import axios from "axios";
import { body } from "express-validator";
import { getDriversByFilter } from "../services/DriverServices.js";
import { getStudentsByFilter } from "../services/StudentServices.js";
import { getAdminsByFilter } from "../services/AdminServices.js";
import { getOrganizationsByFilter } from "../services/OrganizationServices.js";
import auth from "../middlewares/auth.js";
import rejectBadRequests from "../utils/rejectBadRequests.js";

const Router = Express.Router();

/**
 * check if user exists or not
 */

const checkExistenceValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone Number field is required")
    .isInt()
    .withMessage("Phone Number must be a Integer."),
];

// authentication not required since we are just checking if the owner exists.
Router.post(
  "/check-owner-existence",
  checkExistenceValidator,
  rejectBadRequests,
  async (req, res) => {
    try {
      let owner = null;

      const admins = await getAdminsByFilter({
        phoneNumber: req.body.phoneNumber,
      });

      const organizations = await getOrganizationsByFilter({
        phoneNumber: req.body.phoneNumber,
        active: true,
      });

      const drivers = await getDriversByFilter({
        phoneNumber: req.body.phoneNumber,
      });

      if (admins.length > 0) {
        owner = admins[0];
      }

      if (organizations.length > 0) {
        owner = organizations[0];
      }

      if (drivers.length > 0) {
        owner = drivers[0];
      }

      if (owner == undefined || owner == null) {
        return res
          .status(404)
          .json({ success: false, message: "Property owner doesn't exists." });
      }

      return res
        .status(200)
        .json({ success: true, message: "Property owner exists." });
    } catch (err) {
      console.log("error while checking owner existence.");
      console.log(err.message);
      return res
        .status(500)
        .json({ success: false, error: err.message, message: "server error" });
    }
  }
);

/**
 * get owner details
 */
Router.get("/owner-details", auth, async (req, res) => {
  try {
    let owner = null;

    const admins = await getAdminsByFilter({ phoneNumber: req.phoneNumber });

    const organizations = await getOrganizationsByFilter({
      phoneNumber: req.phoneNumber,
      active: true,
    });

    const drivers = await getDriversByFilter({
      phoneNumber: req.phoneNumber,
    });

    if (admins.length > 0) {
      owner = admins[0];
    }

    if (organizations.length > 0) {
      owner = organizations[0];
    }

    if (drivers.length > 0) {
      owner = drivers[0];
    }

    if (owner == undefined || owner == null) {
      return res
        .status(404)
        .json({ success: false, message: "Property owner doesn't exists." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Property owner exists.", data: owner });
  } catch (err) {
    console.log("error while getting owner details.");
    console.log(err.message);
    return res
      .status(500)
      .json({ success: false, error: err.message, message: "server error" });
  }
});

/**
 * create a new user token for user using refresh token
 */
Router.post("/refresh-token", async (req, res) => {
  const data = {
    grant_type: "refresh_token",
    refresh_token: req.body.refreshToken,
  };

  try {
    const newCredentials = await axios
      .post(
        "https://securetoken.googleapis.com/v1/token?key=AIzaSyCSIMIa4z80oydTNeKG-eJ1A8a5Mn1WOGM",
        data
      )
      .then((response) => response)
      .catch((err) => err);
    res.status(200).json({ token: newCredentials.data.id_token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "server error" });
  }
});

export default Router;
