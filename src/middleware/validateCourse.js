const validateCourse = (req, res, next) => {
  const { title, description, category, price } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Course title is required",
    });
  }

  if (!description || !description.trim()) {
    return res.status(400).json({
      success: false,
      message: "Course description is required",
    });
  }

  if (!category || !category.trim()) {
    return res.status(400).json({
      success: false,
      message: "Course category is required",
    });
  }

  if (
    price === undefined ||
    price === null ||
    price === "" ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid course price",
    });
  }

  next();
};

export default validateCourse;
