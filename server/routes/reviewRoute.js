import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  crateNewReview,
  getAllByBookId,
  deleteBookById,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/:bookId", verifyToken, crateNewReview);

router.get("/All/:bookId", getAllByBookId);

router.delete("/delete/:reviewId", verifyToken, deleteBookById);

export default router;
