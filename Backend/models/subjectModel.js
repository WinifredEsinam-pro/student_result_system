import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true }, // e.g. "MATH101"
    name: { type: String, required: true, trim: true },               // e.g. "Mathematics"
    creditHours: { type: Number, required: true, default: 3 },        // for GPA calculation
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;