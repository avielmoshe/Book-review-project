import Review from "../models/reviewModel.js";
import Book from "../models/bookModel.js";

export const crateNewReview = async (req, res) => {
  const userId = req.user._id;
  const { bookId } = req.params;
  const { reviewText, rating } = req.body;
  if (!reviewText || !rating) {
    return res
      .status(400)
      .send({ error: "reviewText and rating are required" });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).send({ error: "Rating must be between 1 and 5" });
  }

  try {
    const existingReview = await Review.findOne({
      createdBy: userId,
      book: bookId,
    });
    if (existingReview) {
      return res
        .status(400)
        .send({ error: "You have already reviewed this book" });
    }

    const newReview = new Review({
      reviewText,
      rating,
      createdBy: userId,
      book: bookId,
    });

    await newReview.save();

    await Book.findByIdAndUpdate(bookId, { $push: { reviews: newReview._id } });

    res.status(201).send({
      message: "Review added successfully",
      newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send({ error: "Server error" });
  }
};

export const getAllByBookId = async (req, res) => {
  try {
    const { bookId } = req.params;
    const bookById = await Book.findById(bookId);
    if (!bookById) {
      return res.status(404).send({ error: "book not found" });
    }
    const reviews = await Review.find({ book: bookId }).populate(
      "createdBy",
      "username email"
    );
    res.status(201).send(reviews);
  } catch (error) {
    console.error("Error finding bookById by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteBookById = async (req, res) => {
  const { reviewId } = req.params;
  const reviewById = await Review.findById(reviewId);
  if (!reviewById) {
    return res.status(404).send({ error: "review not found" });
  }
  if (req.user._id === reviewById.createdBy.toString()) {
    try {
      const deleteReview = await Review.findByIdAndDelete(reviewId);
      res.status(200).send({
        message: "review deleted successfully",
        deleteReview,
      });
    } catch (error) {
      console.error("Error finding review by ID:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else
    res.status(400).send({
      status: "failed",
      mes: "only the user that created the review can delete him",
    });
};
