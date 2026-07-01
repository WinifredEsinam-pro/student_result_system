import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    className: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // linked login account
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;