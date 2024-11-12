const MessageElement = document.getElementById("message");
import { renderBooks } from "./renderService.js";
import { bookById } from "./crudService.js";
import { clickOnFav } from "./main.js";

export const favoritesList = [];

export const toggleHidden = (element) => {
  element.classList.toggle("hidden");
};

export function setCookie(value) {
  const date = new Date();
  date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000); // days to milliseconds
  const expires = "expires=" + date.toUTCString();
  document.cookie = "token" + "=" + value + ";" + expires + ";path=/";
}

export function getCookie(name) {
  const nameEQ = name + "=";
  const cookiesArray = document.cookie.split(";");
  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

export function displayError(message) {
  MessageElement.innerText = message;
  MessageElement.style.color = "red";
  setTimeout(() => {
    MessageElement.innerText = "";
  }, 3000);
}

export function displaySuccess(message) {
  MessageElement.innerText = message;
  MessageElement.style.color = "green";
  setTimeout(() => {
    MessageElement.innerText = "";
  }, 2000);
}

export function deleteCookie() {
  document.cookie =
    "token" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export async function addAndRemoveFavorites(bookId, favBtn) {
  const isBookEx = favoritesList.findIndex((cuurnetBook) => {
    return cuurnetBook._id === bookId;
  });
  if (isBookEx === -1) {
    favoritesList.push(await bookById(bookId));
    favBtn.classList.add("favBtn-click");
    favBtn.textContent = `Remove from Favorites`;
  } else {
    favoritesList.splice(isBookEx, 1);
    favBtn.classList.remove("favBtn-click");
    favBtn.textContent = `Add to Favorites`;
    if (clickOnFav) {
      renderBooks(favoritesList);
    }
  }
}
