import lectureModel from "../models/lecture.model.js";
import courseModel from "../models/course.model.js";

export const getAllLectures = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not found",
      });
    }
    const Lectures = await lectureModel.find({ courseId: courseId });
    res.status(200).json({
      success: true,
      message: "Lectures fetched successfully",
      Lectures,
    });
  } catch (error) {
    next(error);
  }
};

export const createLecture = async (req, res, next) => {
  try {
    const { title, description, videoURL } = req.body;
    const { courseId } = req.params;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Unauthorized : You can only add lectures to your own course.",
      });
    }
    const lecture = await lectureModel.create({
      title,
      description,
      videoURL,
      courseId,
    });
    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLecture = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const { title, description, videoURL } = req.body;
    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not Found",
      });
    }
    const course = await courseModel.findById(lecture.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized : You can only update your own course's lectures",
      });
    }
    const UpdatedLecture = await lectureModel.findByIdAndUpdate(
      lectureId,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(videoURL && { videoURL }),
      },
      { returnDocument: "after" },
    );

    res.status(200).json({
      success: true,
      message: "Lecture updated successfully",
      data: UpdatedLecture,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLecture = async (req, res, next) => {
  try {
    const { lectureId } = req.params;
    const lecture = await lectureModel.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not Found",
      });
    }
    const course = await courseModel.findById(lecture.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized : You can only delete your own course's lectures",
      });
    }
    await lectureModel.findByIdAndDelete(lectureId);
    res.status(200).json({
      success: true,
      message: "Lecture deleted successfully",
      data: lecture,
    });
  } catch (error) {
    next(error);
  }
};
