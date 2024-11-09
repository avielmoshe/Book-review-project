import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
  },
  description: {
    type: String,
  },
  publishedYear: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

export default mongoose.model("Book", bookSchema);
