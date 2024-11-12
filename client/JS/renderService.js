import { getCookie, addAndRemoveFavorites } from "./utils.js";
import { isTokenValid } from "./registerService.js";
import {
  createNewBook,
  getUserId,
  deleteBook,
  bookById,
  getReviewByBookId,
  createNewReview,
  removeReview,
} from "./crudService.js";
import { clickOnFav } from "./main.js";
import { favoritesList } from "./utils.js";

const baseUrl = "http://localhost:3000";
const continerElement = document.getElementById("continer");
const token = getCookie("token");
const welcomeContainerEl = document.querySelector(".welcome-container");

let onMyBooks = false;

export const getAllBooks = async () => {
  onMyBooks = false;
  try {
    const response = await fetch(`${baseUrl}/api/book`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Failed to fetch books:", errorMessage);
    }
    const books = await response.json();
    await renderBooks(books);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getMyBooks = async () => {
  onMyBooks = true;
  const user = await getUserId();
  try {
    const response = await fetch(
      `${baseUrl}/api/book?createdBy=${user.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Failed to fetch books:", errorMessage);
      alert(`Failed to fetch books: ${errorMessage}`);
      return;
    }
    const books = await response.json();
    await renderBooks(books);
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching books.");
  }
};

export const renderWelcome = async () => {
  const userData = await isTokenValid(token);

  if (userData && userData.username) {
    welcomeContainerEl.innerHTML = `
      <h1 class="welcome-title">Welcome, <span class="username">${userData.username}</span>!</h1>
    `;
  } else {
    welcomeContainerEl.innerHTML = `<h1 class="welcome-title">Welcome, Guest!</h1>`;
  }
};

export const renderBooks = async (books) => {
  console.log(onMyBooks);

  continerElement.innerHTML = "";
  books.forEach((book) => {
    const isTheBookOnFav = favoritesList.find((currentBook) => {
      return currentBook._id === book._id;
    });
    const bookItem = document.createElement("div");
    bookItem.classList.add("book-item");
    if (!isTheBookOnFav) {
      if (onMyBooks) {
        bookItem.innerHTML = `
        <div class="bookCard">
    <img src="..//book-cover-clip-art-png-favpng-2at3YzDbuVJiKb1NLzULi1zjX.jpg" 
                 alt="${book.title}">        
            <h1>${book.title}</h1>
           <div>Author: ${book.author}</div>
           <div>Genre: ${book.genre} </div> 
           <div>Published Year: ${book.publishedYear} </div> 
            <button class="card-button fav-btn">Add to Favorites</button>
           <button class="card-button delete-btn">Delete Book</button>
              </div>
          `;
      } else {
        bookItem.innerHTML = `
      <div class="bookCard">
  <img src="..//book-cover-clip-art-png-favpng-2at3YzDbuVJiKb1NLzULi1zjX.jpg" 
               alt="${book.title}">        
          <h1>${book.title}</h1>
         <div>Author: ${book.author}</div>
         <div>Genre: ${book.genre} </div> 
         <div>Published Year: ${book.publishedYear} </div> 
            <button class="card-button fav-btn">Add to Favorites</button>
          </div>
        `;
      }
    } else {
      if (onMyBooks) {
        bookItem.innerHTML = `
        <div class="bookCard">
    <img src="..//book-cover-clip-art-png-favpng-2at3YzDbuVJiKb1NLzULi1zjX.jpg" 
                 alt="${book.title}">        
            <h1>${book.title}</h1>
           <div>Author: ${book.author}</div>
           <div>Genre: ${book.genre} </div> 
           <div>Published Year: ${book.publishedYear} </div> 
          <button class="card-button fav-btn favBtn-click">Remove from Favorites</button>
           <button class="card-button delete-btn">Delete Book</button>
              </div>
          `;
      } else {
        bookItem.innerHTML = `
    <div class="bookCard">
<img src="..//book-cover-clip-art-png-favpng-2at3YzDbuVJiKb1NLzULi1zjX.jpg" 
             alt="${book.title}">        
        <h1>${book.title}</h1>
       <div>Author: ${book.author}</div>
       <div>Genre: ${book.genre} </div> 
       <div>Published Year: ${book.publishedYear} </div> 
          <button class="card-button fav-btn favBtn-click">Remove from Favorites</button>
        </div>
      `;
      }
    }
    continerElement.appendChild(bookItem);
    if (onMyBooks) {
      const deleteBtn = bookItem.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        deleteBook(book._id);
      });
    }
    const imgBtn = bookItem.querySelector("img");
    imgBtn.addEventListener("click", () => {
      welcomeContainerEl.innerHTML = "";
      renderBookPage(book._id);
    });
    const favBtn = bookItem.querySelector(".fav-btn");
    favBtn.addEventListener("click", () => {
      addAndRemoveFavorites(book._id, favBtn);
    });
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

export const renderBookPage = async (bookId) => {
  const book = await bookById(bookId);
  const bookReviews = await getReviewByBookId(bookId);
  continerElement.innerHTML = "";
  const bookCard = document.createElement("div");
  bookCard.classList.add("bookPage");
  bookCard.innerHTML = `
    <h1>${book.title}</h1>
    <div>Author: ${book.author}</div>
    <div>Genre: ${book.genre}</div>
    <div>Published Year: ${book.publishedYear}</div>
    <div>description: ${book.description}</div>
    <div>Upload At: ${new Date(book.createdAt).toLocaleDateString()}</div>
    <h2>Reviews:</h2>
  `;
  continerElement.appendChild(bookCard);

  const reviewsContainer = document.createElement("div");
  reviewsContainer.classList.add("reviewsContainer");
  if (!bookReviews.length) {
    reviewsContainer.innerHTML = `pls add new review to see it`;
  }
  bookReviews.forEach((review) => {
    const reviewItem = document.createElement("div");
    reviewItem.classList.add("review-item");
    reviewItem.innerHTML = `
    <p><strong>Review:</strong> ${review.reviewText}</p>
    <p><strong>Rating:</strong> ${review.rating} / 5</p>
    <p><strong>username:</strong></br> ${review.createdBy.username}</p>
    <p><strong>Reviewed On:</strong> ${new Date(
      review.createdAt
    ).toLocaleDateString()}</p>
    <button class="remove-review-btn">Remove Review</button>
  `;
    reviewsContainer.appendChild(reviewItem);
    const removeReviewBtn = reviewItem.querySelector(".remove-review-btn");
    removeReviewBtn.addEventListener("click", async () => {
      const message = await removeReview(review._id);
      if (message === "review deleted successfully") {
        renderBookPage(bookId);
      }
    });
  });
  bookCard.appendChild(reviewsContainer);

  const addReviewForm = document.createElement("form");
  addReviewForm.classList.add("add-review-form");
  addReviewForm.innerHTML = `
  <h3>Add New Review:</h3>
  <textarea id="newReviewText" placeholder="Enter review text" required></textarea>
  <label id="newReviewRating">Rating (1-5)</label>
  <input type="number" id="newReviewRating" class="newReviewRating"min="1" max="5" placeholder="Rating (1-5)" required>
  <button type="submit">Add Review</button>
`;

  addReviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newReview = {
      reviewText: event.target[0].value,
      rating: event.target[1].value,
    };
    createNewReview(newReview, bookId);
  });
  bookCard.appendChild(addReviewForm);
};
