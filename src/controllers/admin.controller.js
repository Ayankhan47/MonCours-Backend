
import userModel from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import mongoose from "mongoose";

export const getPendingInstructors = async (req, res) => {
  try {
    const instructors = await userModel
      .find({ role: "pending_instructor" })
      .select("-password");

    return res.status(200).json({
      success: true,
      count: instructors.length,
      data: instructors,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve instructor
export const approveInstructor = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await userModel.findById(userId);

    if (!user || user.role !== "pending_instructor") {
      return res.status(404).json({
        success: false,
        message: "Pending instructor not found",
      });
    }

    user.role = "instructor";
    await user.save();

    await sendEmail(
      user.email,
      "MonCours - Instructor Account Approved",
      `<h2>Congratulations, ${user.name}!</h2>
       <p>Your instructor account has been approved.</p>
       <p>You can now log in and start creating courses on MonCours.</p>`
    );

    return res.status(200).json({
      success: true,
      message: "Instructor approved and email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reject instructor
export const rejectInstructor = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await userModel.findById(userId);

    if (!user || user.role !== "pending_instructor") {
      return res.status(404).json({
        success: false,
        message: "Pending instructor not found",
      });
    }

    user.role = "student";
    await user.save();

    await sendEmail(
      user.email,
      "MonCours - Instructor Application Update",
      `<h2>Hello, ${user.name}</h2>
       <p>Unfortunately, your instructor application has not been approved.</p>
       <p>You can continue using MonCours as a student.</p>`
    );

    return res.status(200).json({
      success: true,
      message: "Instructor rejected and email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
