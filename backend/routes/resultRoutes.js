import express from "express";
import {
  addResult,
  getAllResults,
  getStudentResults,
  updateResult,
  deleteResult,
} from "../controllers/resultController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", adminOnly, getAllResults);
router.get("/student/:studentId", getStudentResults);
router.post("/", adminOnly, addResult);
router.put("/:id", adminOnly, updateResult);
router.delete("/:id", adminOnly, deleteResult);

export default router;