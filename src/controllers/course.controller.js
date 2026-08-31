import courseModel from "../models/course.model.js";

export const getCourses = async (req, res) => {
  try {
    const filter = {};

    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.maxPrice) {
      filter.price = {
        $lte: req.query.maxPrice,
      };
    }
    if (req.query.minPrice) {
      filter.price = {
        ...filter.price,
        $gte: req.query.minPrice,
      };
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit)|| 10;
    const skip = (page - 1)*limit;

    const courses = await courseModel
      .find(filter)
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit);
    if (courses.length === 0) {
      return res.status(404).json({
        message: "No course found!",
      });
    }
    res.status(200).json({
      message: "Courses fetched successfully",
      data: courses,
      currentPage : page,
      totalpages : Math.ceil((await courseModel.countDocuments(filter))/limit)

    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const course = await courseModel.create({
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.body.thumbnail,
      category: req.body.category,
      price: req.body.price,
      createdBy: req.user.id,
      createdAt: Date.now(),
    });
    res.status(201).json({
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.user.role !== "admin" && course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own course."
      });
    }

    await courseModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (req.user.role !== "admin" && course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can only update your own course."
      });
    }

    const updated = await courseModel.findByIdAndUpdate(
      req.params.id,
      {
        ...(req.body.title && { title: req.body.title }),
        ...(req.body.description && { description: req.body.description }),
        ...(req.body.thumbnail && { thumbnail: req.body.thumbnail }),
        ...(req.body.price && { price: req.body.price }),
        ...(req.body.category && { category: req.body.category }),
        updatedAt: Date.now(),
      },
      { returnDocument: "after" },
    );
    res.status(200).json({
      message: "Course updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
