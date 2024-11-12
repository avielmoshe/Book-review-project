import { displayError, displaySuccess, getCookie } from "./utils.js";
import { getMyBooks, renderBookPage } from "./renderService.js";
const token = getCookie("token");
const baseUrl = "http://localhost:3000";

export const createNewBook = async (book) => {
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

    displaySuccess("Book successfully created!");
    setTimeout(() => {
      getMyBooks();
    }, 2000);
  } catch (error) {
    console.error("Error:", error);
    displayError("Failed to connect to the server. Please try again later.");
  }
};

export const getUserId = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Failed to fetch user:", errorMessage);
      return;
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteBook = async (bookId) => {
  console.log(bookId);
  try {
    const response = await fetch(`${baseUrl}/api/book/byId/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      displayError(`Failed to delete book. Status: ${response.status}`);
      throw new Error(`Failed to delete book. Status: ${response.status}`);
    }

    const data = await response.json();
    displaySuccess(
      `the Book ${data.deleteBook.title} has been deleted successfully.`
    );
    getMyBooks();
  } catch (error) {
    console.error("Error deleting book:", error);
    alert("An error occurred while deleting the book. Please try again.");
  }
};

export const bookById = async (bookId) => {
  try {
    const response = await fetch(`${baseUrl}/api/book/byId/${bookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Failed to fetch user:", errorMessage);
      return;
    }
    const book = await response.json();
    return book;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getReviewByBookId = async (bookId) => {
  try {
    const response = await fetch(`${baseUrl}/api/review/All/${bookId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error("Failed to fetch user:", errorMessage);
      return;
    }
    const reviews = await response.json();
    return reviews;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const createNewReview = async (newReview, bookId) => {
  try {
    const response = await fetch(`${baseUrl}/api/review/${bookId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    });

    const responseData = await response.json();
    if (!response.ok) {
      displayError(
        responseData.message || responseData.error || "Unknown error occurred"
      );
      return;
    }
    displaySuccess("review successfully added!");
    renderBookPage(bookId);
  } catch (error) {
    console.error("Error:", error);
    displayError("Failed to connect to the server. Please try again later.");
  }
};

export const removeReview = async (reviewId, bookId) => {
  try {
    const response = await fetch(`${baseUrl}/api/review/delete/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      displayError(`Failed to delete review. Status: ${response.status}`);
      throw new Error(`Failed to delete review. Status: ${response.status}`);
    }
    const data = await response.json();
    displaySuccess(`review has been deleted successfully.`);
    return data.message;
  } catch (error) {
    console.error("Error deleting book:", error);
    alert("An error occurred while deleting the book. Please try again.");
  }
};
