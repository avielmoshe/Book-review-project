import {
  toggleHidden,
  setCookie,
  displayError,
  displaySuccess,
} from "./utils.js";
import { renderWelcome, getAllBooks } from "./renderService.js";

const baseUrl = "http://localhost:3000";
const MessageElement = document.getElementById("message");
const signUpPageEl = document.querySelector(".signUp");
const loginPageEl = document.querySelector(".login");
const navLinksEl = document.querySelector(".nav-links");

export const isTokenValid = async (jwtToken) => {
  try {
    const response = await fetch(`${baseUrl}/api/user/validateToken`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export const createNewUser = async (user) => {
  try {
    const response = await fetch(`${baseUrl}/api/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const responseData = await response.json();
    if (!response.ok) {
      displayError(
        responseData.message || responseData.error || "Unknown error occurred"
      );
      return;
    }

    console.log("Success:", responseData);
    displaySuccess("User successfully registered!");
    toggleHidden(loginPageEl);
    toggleHidden(signUpPageEl);
  } catch (error) {
    console.error("Error:", error);
    displayError("Failed to connect to the server. Please try again later.");
  }
};

export const signInUser = async (userCredentials) => {
  try {
    const response = await fetch(`${baseUrl}/api/user/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    });

    const responseData = await response.json();
    if (!response.ok) {
      displayError(
        responseData.message || responseData.error || "Unknown error occurred"
      );
      return;
    }
    console.log("Sign-in Success:", responseData);
    displaySuccess("Sign-in successful! pls wait");
    setCookie(responseData.token);
    setTimeout(() => {
      getAllBooks();
      renderWelcome();
    }, 2000);
    location.reload();
    toggleHidden(loginPageEl);
    toggleHidden(navLinksEl);
  } catch (error) {
    console.error("Sign-in Error:", error);
    displayError("Failed to connect to the server. Please try again later.");
  }
};
