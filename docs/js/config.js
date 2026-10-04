/**
 * 前端配置：后端 API 地址。
 * 可通过界面底部输入框修改，修改后保存在 localStorage 中。
 */
const DEFAULT_API_BASE = "https://eight32402224-calculator-backend.onrender.com";

function getApiBase() {
  return localStorage.getItem("apiBase") || DEFAULT_API_BASE;
}

function setApiBase(value) {
  localStorage.setItem("apiBase", value.replace(/\/+$/, ""));
}
