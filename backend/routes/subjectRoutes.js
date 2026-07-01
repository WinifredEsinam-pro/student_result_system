import express from "express";
import {
  addSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getSubjects);
router.get("/:id", getSubjectById);
router.post("/", adminOnly, addSubject);
router.put("/:id", adminOnly, updateSubject);
router.delete("/:id", adminOnly, deleteSubject);

export default router;