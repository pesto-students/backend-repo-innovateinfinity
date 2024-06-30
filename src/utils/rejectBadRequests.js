import { validationResult } from "express-validator";

const rejectBadRequests = async (req, res, next) => {
  // Give 400 (bad request) on validation error.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
}

export default rejectBadRequests;
