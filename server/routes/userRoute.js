import express from "express";
import {
  createNewUser,
  updateUser,
  deleteUser,
  singInUser,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", createNewUser);

router.post("/signIn", singInUser);

router.patch("/updateUser", verifyToken, updateUser);

router.delete("/deleteUser", verifyToken, deleteUser);

export default router;
