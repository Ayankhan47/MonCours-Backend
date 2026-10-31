import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
}) 
enrollmentSchema.index(
  { studentId: 1, courseId: 1 },
  { unique: true }
);

const enrollmentModel = mongoose.model("Enrollment", enrollmentSchema);
export default enrollmentModel;