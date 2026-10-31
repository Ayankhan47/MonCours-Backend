const invalidCourseField = (res, message) =>
  res.status(400).json({
    success: false,
    message,
  });

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidPrice = (value) => {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    (typeof value === "string" && value.trim() === "")
  ) {
    return false;
  }

  return Number.isFinite(Number(value)) && Number(value) >= 0;
};

const validateCourse = (req, res, next) => {
  const { title, description, category, price } = req.body;

  if (!isNonEmptyString(title)) {
    return invalidCourseField(res, "Course title is required");
  }

  if (!isNonEmptyString(description)) {
    return invalidCourseField(res, "Course description is required");
  }

  if (!isNonEmptyString(category)) {
    return invalidCourseField(res, "Course category is required");
  }

  if (price === undefined || !isValidPrice(price)) {
    return invalidCourseField(res, "Please provide a valid course price");
  }

  if (
    req.body.thumbnail !== undefined &&
    typeof req.body.thumbnail !== "string"
  ) {
    return invalidCourseField(res, "Please provide a valid course thumbnail");
  }

  next();
};

export const validateCourseUpdate = (req, res, next) => {
  const { title, description, thumbnail, category, price } = req.body;

  if (title !== undefined && !isNonEmptyString(title)) {
    return invalidCourseField(res, "Course title cannot be empty");
  }

  if (description !== undefined && typeof description !== "string") {
    return invalidCourseField(res, "Please provide a valid course description");
  }

  if (thumbnail !== undefined && typeof thumbnail !== "string") {
    return invalidCourseField(res, "Please provide a valid course thumbnail");
  }

  if (category !== undefined && !isNonEmptyString(category)) {
    return invalidCourseField(res, "Course category cannot be empty");
  }

  if (price !== undefined && !isValidPrice(price)) {
    return invalidCourseField(res, "Please provide a valid course price");
  }

  next();
};

export default validateCourse;
