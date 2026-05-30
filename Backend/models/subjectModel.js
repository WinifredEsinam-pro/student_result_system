import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true }, 
    name: { type: String, required: true, trim: true },               
    creditHours: { type: Number, required: true, default: 3 },      
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;