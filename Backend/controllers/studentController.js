import Student from "../models/studentModel.js";

// Add a student (admin only)
export const addStudent = async (req, res) => {
  try {
    const { studentId, name, email, className } = req.body;

    if (await Student.findOne({ studentId }))
      return res.status(400).json({ message: "Student ID already exists" });

    if (await Student.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    const student = await Student.create({ studentId, name, email, className });
    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single student
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};