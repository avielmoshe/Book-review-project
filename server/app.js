import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import usersRoutes from "./routes/userRoute.js";
import booksRoutes from "./routes/bookRoute.js";
import reviewsRoutes from "./routes/reviewRoute.js";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
dotenv.config();

const uri = process.env.DB_URI;
mongoose.connect(uri).then(() => {
  console.log("connected");
});

app.get("/api/status", (req, res) => {
  res.send({ status: "server is running" });
});

//routes
app.use("/api/user", usersRoutes);

app.use("/api/book", booksRoutes);

app.use("/api/review", reviewsRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
