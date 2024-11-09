const MessageElement = document.getElementById("message");
import { renderBooks } from "./renderService.js";

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
    renderBooks();
  }, 2000);
}

export function displaySuccess(message) {
  MessageElement.innerText = message;
  MessageElement.style.color = "green";
  setTimeout(() => {
    MessageElement.innerText = "";
    renderBooks();
  }, 2000);
}
