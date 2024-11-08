import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(morgan("tiny"));
dotenv.config();

const uri = process.env.DB_URI;
mongoose.connect(uri).then(() => {
  console.log("connected");
});

app.get("/api/status", (req, res) => {
  res.send({ status: "server is running" });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
