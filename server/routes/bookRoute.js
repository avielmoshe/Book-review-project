import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  crateNewBook,
  getBooks,
  getBookById,
  deleteBookById,
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/crateBook", verifyToken, crateNewBook);

router.get("/", getBooks);

router.get("/byId/:id", getBookById);

router.delete("/byId/:id", verifyToken, deleteBookById);

export default router;
