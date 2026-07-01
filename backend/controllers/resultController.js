import Result from "../models/resultModel.js";
import Student from "../models/studentModel.js";
import Subject from "../models/subjectModel.js";

// Grade calculator
const getGradeInfo = (score) => {
  if (score >= 90) return { grade: "A+", gradePoints: 4.0 };
  if (score >= 80) return { grade: "A",  gradePoints: 4.0 };
  if (score >= 75) return { grade: "B+", gradePoints: 3.5 };
  if (score >= 70) return { grade: "B",  gradePoints: 3.0 };
  if (score >= 65) return { grade: "C+", gradePoints: 2.5 };
  if (score >= 60) return { grade: "C",  gradePoints: 2.0 };
  if (score >= 55) return { grade: "D+", gradePoints: 1.5 };
  if (score >= 50) return { grade: "D",  gradePoints: 1.0 };
  return { grade: "F", gradePoints: 0.0 };
};

// Enter results for a student
export const addResult = async (req, res) => {
  try {
    const { studentId, semester, results } = req.body;
  

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Check duplicate semester result
    const exists = await Result.findOne({ student: studentId, semester });
    if (exists)
      return res.status(400).json({ message: "Result for this semester already exists" });

    // Build result entries with grade info
    let totalWeightedPoints = 0;
    let totalCredits = 0;
    const resultEntries = [];

    for (const item of results) {
      const subject = await Subject.findById(item.subjectId);
      if (!subject)
        return res.status(404).json({ message: `Subject ${item.subjectId} not found` });

      const { grade, gradePoints } = getGradeInfo(item.score);
      totalWeightedPoints += gradePoints * subject.creditHours;
      totalCredits += subject.creditHours;

      resultEntries.push({
        subject: subject._id,
        score: item.score,
        grade,
        gradePoints,
      });
    }

    const gpa = totalCredits > 0
      ? parseFloat((totalWeightedPoints / totalCredits).toFixed(2))
      : 0;

    const remarks = resultEntries.some((r) => r.grade === "F") ? "Fail" : "Pass";

    const result = await Result.create({
      student: studentId,
      semester,
      results: resultEntries,
      gpa,
      totalCredits,
      remarks,
    });

    await result.populate("student results.subject");
    res.status(201).json({ message: "Result added successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all results
export const getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate("student", "name studentId className")
      .populate("results.subject", "name code creditHours")
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get results for a specific student (transcript)
export const getStudentResults = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const results = await Result.find({ student: req.params.studentId })
      .populate("results.subject", "name code creditHours")
      .sort({ semester: 1 });

    // Calculate CGPA across all semesters
    let totalWeightedPoints = 0;
    let totalCredits = 0;
    results.forEach((r) => {
      totalWeightedPoints += r.gpa * r.totalCredits;
      totalCredits += r.totalCredits;
    });
    const cgpa = totalCredits > 0
      ? parseFloat((totalWeightedPoints / totalCredits).toFixed(2))
      : 0;

    res.json({ student, results, cgpa });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a result
export const updateResult = async (req, res) => {
  try {
    const { results } = req.body;
    const existingResult = await Result.findById(req.params.id);
    if (!existingResult) return res.status(404).json({ message: "Result not found" });

    let totalWeightedPoints = 0;
    let totalCredits = 0;
    const resultEntries = [];

    for (const item of results) {
      const subject = await Subject.findById(item.subjectId);
      if (!subject)
        return res.status(404).json({ message: `Subject ${item.subjectId} not found` });

      const { grade, gradePoints } = getGradeInfo(item.score);
      totalWeightedPoints += gradePoints * subject.creditHours;
      totalCredits += subject.creditHours;

      resultEntries.push({ subject: subject._id, score: item.score, grade, gradePoints });
    }

    const gpa = totalCredits > 0
      ? parseFloat((totalWeightedPoints / totalCredits).toFixed(2))
      : 0;
    const remarks = resultEntries.some((r) => r.grade === "F") ? "Fail" : "Pass";

    existingResult.results = resultEntries;
    existingResult.gpa = gpa;
    existingResult.totalCredits = totalCredits;
    existingResult.remarks = remarks;
    await existingResult.save();

    await existingResult.populate("student results.subject");
    res.json({ message: "Result updated", result: existingResult });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a result
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.json({ message: "Result deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};