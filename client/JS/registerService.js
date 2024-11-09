import {
  toggleHidden,
  setCookie,
  displayError,
  displaySuccess,
} from "./utils.js";

const baseUrl = "http://localhost:3000";
const MessageElement = document.getElementById("message");
const signUpPageEl = document.querySelector(".signUp");
const loginPageEl = document.querySelector(".login");
const navLinksEl = document.querySelector(".nav-links");

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
    toggleHidden(loginPageEl);
    toggleHidden(navLinksEl);
  } catch (error) {
    console.error("Sign-in Error:", error);
    displayError("Failed to connect to the server. Please try again later.");
  }
};
