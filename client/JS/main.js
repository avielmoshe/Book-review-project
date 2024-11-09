import { createNewUser, signInUser } from "./registerService.js";
import { toggleHidden } from "./utils.js";
import { renderBooks, renderAddBook } from "./renderService.js";

const signUpPageEl = document.querySelector(".signUp");
const loginPageEl = document.querySelector(".login");
const signUpForm = document.getElementById("signUp");
const loginForm = document.getElementById("login");
const goToSignUpPageEl = document.getElementById("goToSignUpPage");
const alreadySignUpEl = document.getElementById("alreadySignUp");
const MessageElement = document.getElementById("message");
const logoutEl = document.getElementById("logout");
const navLinksEl = document.querySelector(".nav-links");
const continerElement = document.getElementById("continer");
const BooksElement = document.getElementById("Books");
const addBookElement = document.getElementById("addBook");

signUpForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const user = {
    username: event.target[0].value,
    email: event.target[1].value,
    password: event.target[2].value,
  };
  createNewUser(user);
  signUpForm.reset();
});

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const userLoginIn = {
    email: event.target[0].value,
    password: event.target[1].value,
  };
  signInUser(userLoginIn);
  loginForm.reset();
});

goToSignUpPageEl.addEventListener("click", () => {
  toggleHidden(loginPageEl);
  toggleHidden(signUpPageEl);
  MessageElement.innerText = "";
});

alreadySignUpEl.addEventListener("click", () => {
  toggleHidden(loginPageEl);
  toggleHidden(signUpPageEl);
  MessageElement.innerText = "";
});

BooksElement.addEventListener("click", () => {
  renderBooks();
});

addBookElement.addEventListener("click", () => {
  renderAddBook();
});

logoutEl.addEventListener("click", () => {
  document.cookie =
    "token" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  alert("You have been logged out.");
  toggleHidden(navLinksEl);
  toggleHidden(loginPageEl);
  continerElement.textContent = "";
});
