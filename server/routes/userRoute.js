import express from "express";
import {
  createNewUser,
  updateUser,
  deleteUser,
  singInUser,
  TokenValid,
  getUserId,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/validateToken", verifyToken, TokenValid);

router.get("/", verifyToken, getUserId);

router.post("/signup", createNewUser);

router.post("/signIn", singInUser);

router.patch("/updateUser", verifyToken, updateUser);

router.delete("/deleteUser", verifyToken, deleteUser);

export default router;
