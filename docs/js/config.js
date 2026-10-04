/**
 * 前端配置：后端 API 地址。
 * 可通过界面底部输入框修改，修改后保存在 localStorage 中。
 */
const DEFAULT_API_BASE = "http://127.0.0.1:8000";

function getApiBase() {
  return localStorage.getItem("apiBase") || DEFAULT_API_BASE;
}

function setApiBase(value) {
  localStorage.setItem("apiBase", value.replace(/\/+$/, ""));
}
