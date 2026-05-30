import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    semester: { type: String, required: true }, // e.g. "2024 Semester 1"
    results: [
      {
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
        score: { type: Number, required: true, min: 0, max: 100 },
        grade: { type: String },
        gradePoints: { type: Number },
      },
    ],
    gpa: { type: Number, default: 0 },
    totalCredits: { type: Number, default: 0 },
    remarks: { type: String, default: "Pass" },
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);
export default Result;