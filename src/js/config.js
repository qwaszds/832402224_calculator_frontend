/**
 * Front-end configuration: backend API base URL.
 * It can be changed from the input box at the bottom of the page;
 * the value is stored in localStorage.
 */
const DEFAULT_API_BASE = "https://eight32402224-calculator-backend.onrender.com";

function getApiBase() {
  return localStorage.getItem("apiBase") || DEFAULT_API_BASE;
}

function setApiBase(value) {
  localStorage.setItem("apiBase", value.replace(/\/+$/, ""));
}
