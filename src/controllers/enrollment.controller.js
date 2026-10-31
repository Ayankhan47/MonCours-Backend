import enrollmentModel from "../models/enrollment.model.js";
import courseModel from "../models/course.model.js";

export const enrollCourse = async (req, res, next) => {
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
    next(error);
  }
};
export const getEnrolledCourses = async (req, res, next) => {
  try {
    const enrollments = await enrollmentModel
      .find({ studentId: req.user.id })
      .populate("courseId", "title description price category");

    res.status(200).json({
      count: enrollments.length,
      message: "Enrolled course fetched successfully",
      data: enrollments,
    });
  } catch (error) {
   if (error.code === 11000) {
     const duplicateEnrollmentError = new Error("You are already enrolled in this course");
     duplicateEnrollmentError.statusCode = 409;
     return next(duplicateEnrollmentError);
   }
   next(error);
  }
};
export const unenrollCourse = async (req, res, next) => {
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
    next(error);
  }
};
