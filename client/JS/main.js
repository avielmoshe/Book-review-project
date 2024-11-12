import { createNewUser, signInUser, isTokenValid } from "./registerService.js";
import { toggleHidden } from "./utils.js";
import {
  renderWelcome,
  renderAddBook,
  getAllBooks,
  getMyBooks,
  renderBooks,
} from "./renderService.js";
import { getCookie, deleteCookie, favoritesList } from "./utils.js";

const token = getCookie("token");
const welcomeContainerEl = document.querySelector(".welcome-container");
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
const aboutElement = document.getElementById("about");
const myBooksElement = document.getElementById("myBooks");
const containerAboutElement = document.querySelector(".container-about");
const favEl = document.getElementById("favorite");

let clickOnAbout = false;
export let clickOnFav = false;

async function isAlreadyLogin() {
  let isUserValid = false;
  try {
    isUserValid = await isTokenValid(token);
    if (isUserValid.userValid) {
      toggleHidden(loginPageEl);
      toggleHidden(navLinksEl);
      getAllBooks();
      renderWelcome();
    }
  } catch (error) {
    console.log("user token is not auth");
  }
}
isAlreadyLogin();

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
  clickOnFav = false;
  if (clickOnAbout) {
    toggleHidden(containerAboutElement);
    clickOnAbout = false;
  }
  getAllBooks();
});

myBooksElement.addEventListener("click", () => {
  clickOnFav = false;
  getMyBooks();
});

addBookElement.addEventListener("click", () => {
  clickOnFav = false;
  welcomeContainerEl.textContent = "";
  if (clickOnAbout) {
    toggleHidden(containerAboutElement);
    clickOnAbout = false;
  }
  renderAddBook();
});

aboutElement.addEventListener("click", () => {
  clickOnFav = false;
  clickOnAbout = true;
  welcomeContainerEl.textContent = "";
  continerElement.textContent = "";
  toggleHidden(containerAboutElement);
});

favEl.addEventListener("click", () => {
  clickOnFav = true;
  renderBooks(favoritesList);
});

logoutEl.addEventListener("click", () => {
  deleteCookie();
  location.reload();
  alert("You have been logged out.");
  clickOnFav = false;
  if (clickOnAbout) {
    toggleHidden(containerAboutElement);
    clickOnAbout = false;
  }
  toggleHidden(navLinksEl);
  toggleHidden(loginPageEl);
  continerElement.textContent = "";
  welcomeContainerEl.textContent = "";
});
