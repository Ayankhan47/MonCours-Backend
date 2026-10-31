import mongoose from "mongoose";

const validateObjectId = (...paramNames) => (req, res, next) => {
  for (const paramName of paramNames) {
    if (!mongoose.isValidObjectId(req.params[paramName])) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}`,
      });
    }
  }

  next();
};

export default validateObjectId;
