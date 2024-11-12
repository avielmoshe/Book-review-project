import User from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/auth.js";
import JWT from "jsonwebtoken";
const JWT_EXPIRATION = { expiresIn: "1h" };

export const TokenValid = (req, res) => {
  try {
    res.status(200).send({
      userValid: true,
      username: req.user.username,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Something went wrong. Please try again later." });
  }
};

export const getUserId = (req, res) => {
  try {
    res.status(200).send({
      userId: req.user._id,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Something went wrong. Please try again later." });
  }
};

export const createNewUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .send({ error: "email ,username and password are required" });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send({
      status: "success",
      message: "User Succefully Regitered",
      data: newUser,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const singInUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!password || (!email && !username)) {
    return res
      .status(400)
      .send({ error: "email/username and password is required" });
  }
  try {
    const foundUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (!foundUser) {
      return res.status(404).send({ error: "Email/username not found." });
    }

    const isAuth = await comparePassword(password, foundUser.password);
    if (!isAuth) {
      return res.status(401).send({ error: "Invalid password." });
    }

    const { _id, username, email, createdAt } = foundUser;
    const filteredUser = { _id, username, email, createdAt };

    const token = JWT.sign(filteredUser, process.env.JWT_KEY, JWT_EXPIRATION);

    res.status(200).send({
      token,
      message: "Authentication successful",
      isAuth: true,
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    res
      .status(500)
      .send({ error: "Something went wrong. Please try again later." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const id = req.user._id;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(201).send({
      message: "user updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error updating user", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.user._id;
    const deleteUser = await User.findByIdAndDelete(id);
    res.status(200).send({
      message: "user deleted successfully",
      deleteUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
