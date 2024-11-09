import Book from "../models/bookModel.js";

export const crateNewBook = async (req, res) => {
  const { title, author, genre, publishedYear, description } = req.body;

  if (!title || !author || !genre || !publishedYear) {
    return res.status(400).json({
      error: "All fields (title, author, genre, publishedYear) are required",
    });
  }

  try {
    const newBook = new Book({
      title,
      author,
      genre,
      description,
      publishedYear,
      createdBy: req.user._id,
    });

    const savedBook = await newBook.save();
    res.status(201).send({
      status: "book Succefully created",
      savedBook,
    });
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Server error. Could not create book." });
  }
};

export const getBooks = async (req, res) => {
  try {
    const { genre, author } = req.query;
    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = author;

    const books = await Book.find(filter).select("-reviews");

    res.status(200).send(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send({ error: "Server error" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookById = await Book.findById(id);
    if (!bookById) {
      return res.status(404).send({ error: "book not found" });
    }
    res.status(201).send(bookById);
  } catch (error) {
    console.error("Error finding bookById by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteBookById = async (req, res) => {
  const { id } = req.params;
  const bookById = await Book.findById(id);
  if (!bookById) {
    return res.status(404).send({ error: "Book not found" });
  }
  if (req.user._id === bookById.createdBy.toString()) {
    try {
      const deleteBook = await Book.findByIdAndDelete(id);
      res.status(200).send({
        message: "Book deleted successfully",
        deleteBook,
      });
    } catch (error) {
      console.error("Error finding book by ID:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else
    res.status(400).send({
      status: "failed",
      mes: "only user that created the book can delete him",
    });
};
