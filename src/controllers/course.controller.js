import courseModel from "../models/course.model.js";

export const getCourses = async (req, res, next) => {
  try {
    const filter = {};

    const maxPrice = Number(req.query.maxPrice);
    const minPrice = Number(req.query.minPrice);

    if (req.query.search) {
      filter.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.maxPrice !== undefined) {
      if (!Number.isFinite(maxPrice) || maxPrice < 0) {
        return res.status(400).json({
          message: "Invalid maximum price",
        });
      }

      filter.price = { ...filter.price, $lte: maxPrice };
    }

    if (req.query.minPrice !== undefined) {
      if (!Number.isFinite(minPrice) || minPrice < 0) {
        return res.status(400).json({
          message: "Invalid minimum price",
        });
      }

      filter.price = { ...filter.price, $gte: minPrice };
    }
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

    const skip = (page - 1) * limit;

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
      currentPage: page,
      totalpages: Math.ceil((await courseModel.countDocuments(filter)) / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
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
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await courseModel.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only delete your own course.",
      });
    }

    await courseModel.findByIdAndDelete(req.params.courseId);
    res.status(200).json({
      message: "Course deleted successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await courseModel.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only update your own course.",
      });
    }

    const updated = await courseModel.findByIdAndUpdate(
      req.params.courseId,
      {
        ...(req.body.title !== undefined && { title: req.body.title }),
        ...(req.body.description !== undefined && {
          description: req.body.description,
        }),
        ...(req.body.thumbnail !== undefined && {
          thumbnail: req.body.thumbnail,
        }),
        ...(req.body.price !== undefined && { price: Number(req.body.price) }),
        ...(req.body.category !== undefined && { category: req.body.category }),
        updatedAt: Date.now(),
      },
      { returnDocument: "after", runValidators: true },
    );
    res.status(200).json({
      message: "Course updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
