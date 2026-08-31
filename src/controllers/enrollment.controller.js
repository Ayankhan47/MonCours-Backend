import enrollmentModel from "../models/enrollment.model.js";
import courseModel from "../models/course.model.js";

export const enrollCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    const alreadyEnrolled = await enrollmentModel.findOne({
      studentId: req.user.id,
      courseId: courseId,
    });
    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "You are already enrolled in this course",
      });
    }
    const enrollment = await enrollmentModel.create({
      studentId: req.user.id,
      courseId: courseId,
    });
    res.status(201).json({
      message: "Enrolled Successfully",
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};
export const getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await enrollmentModel
      .find({ studentId: req.user.id })
      .populate("courseId", "title description price category");

    res.status(200).json({
      message: "Enrolled course fetched successfully",
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const unenrollCourse = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    const enrollment = await enrollmentModel.findOne({
      studentId: req.user.id,
      courseId: req.params.courseId,
    });
    if (!enrollment) {
      return res.status(400).json({
        message: "You are not enrolled in this course",
      });
    }
         await enrollment.deleteOne();
      res.status(200).json({
        message: "Unenrolled Successfully",
      });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};
