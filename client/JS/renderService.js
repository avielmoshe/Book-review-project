import { displayError, displaySuccess, getCookie } from "./utils.js";

const baseUrl = "http://localhost:3000";
const continerElement = document.getElementById("continer");
const token = getCookie("token");

const getAllBooks = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/book`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const books = await response.json();

    if (!response.ok) {
      console.error("Failed to fetch books:", books);
      return;
    }
    return books;
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching books.");
  }
};

const createNewBook = async (book) => {
  try {
    const response = await fetch(`${baseUrl}/api/book/crateBook`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(book),
    });

    const responseData = await response.json();
    if (!response.ok) {
      displayError(
        responseData.message || responseData.error || "Unknown error occurred"
      );
      return;
    }

    console.log("Success:", responseData);
    displaySuccess("Book successfully created!");
  } catch (error) {
    console.error("Error:", error);
    displayError("Failed to connect to the server. Please try again later.");
  }
};

export const renderBooks = async () => {
  const books = await getAllBooks();
  console.log(books);
  continerElement.innerHTML = "";
  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");
    bookItem.innerHTML = `
    <div class="bookCard">
<img src="..//book-cover-clip-art-png-favpng-2at3YzDbuVJiKb1NLzULi1zjX.jpg" 
             alt="${book.title}">        
        <h1>${book.title}</h1>
       <div>Author: ${book.author}</div>
       <div>Genre: ${book.genre} </div> 
       <div>Published Year: ${book.publishedYear} </div> 
        <button class="favorite-button" onclick="addToFavorites('${book._id}')">Add to Favorites</button>
        </div>
      `;
    continerElement.appendChild(bookItem);
  });
};

export const renderAddBook = () => {
  continerElement.innerHTML = "";
  const addBookFormElement = document.createElement("form");
  addBookFormElement.id = "createBookForm";
  addBookFormElement.innerHTML = `
  <label for="title">Title</label>
  <input
    id="title"
    name="title"
    placeholder="Enter book title"
    required
    type="text"
  />

  <label for="author">Author</label>
  <input
    id="author"
    name="author"
    placeholder="Enter author name"
    required
    type="text"
  />

  <label for="genre">Genre</label>
  <input
    id="genre"
    name="genre"
    placeholder="Enter book genre"
    required
    type="text"
  />

  <label for="publishedYear">Published Year</label>
  <input
    id="publishedYear"
    name="publishedYear"
    placeholder="Enter published year"
    required
    type="number"
    min="1000"
    max="9999"
  />

  <label for="description">Description</label>
  <textarea
    id="description"
    name="description"
    placeholder="Enter book description (optional)"
    rows="4"
  ></textarea>

  <button type="submit">Create Book</button>
`;
  continerElement.appendChild(addBookFormElement);
  addBookFormElement.addEventListener("submit", function (event) {
    event.preventDefault();
    const newBook = {
      title: event.target[0].value,
      author: event.target[1].value,
      genre: event.target[2].value,
      publishedYear: event.target[3].value,
      description: event.target[4].value,
    };
    createNewBook(newBook);
    addBookFormElement.reset();
  });
};
