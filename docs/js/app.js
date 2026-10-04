/**
 * 界面交互逻辑：按钮输入、键盘输入、请求后端、渲染结果与历史。
 * 注意：本文件不包含任何表达式求值逻辑，结果一律由后端返回。
 */

(function () {
  "use strict";

  // ---------- DOM ----------
  const expressionEl = document.getElementById("expression");
  const resultEl = document.getElementById("result");
  const errorBar = document.getElementById("error-bar");
  const historyList = document.getElementById("history-list");
  const historyCount = document.getElementById("history-count");
  const clearAllBtn = document.getElementById("clear-all");
  const themeToggle = document.getElementById("theme-toggle");
  const apiBaseInput = document.getElementById("api-base");
  const saveApiBtn = document.getElementById("save-api");
  const connStatus = document.getElementById("conn-status");

  let expression = "";
  let lastResult = null;

  // ---------- 显示 ----------
  /** 将内部表达式（* /）显示为（× ÷）。 */
  function pretty(text) {
    return text.replace(/\*/g, "×").replace(/\//g, "÷");
  }

  function render() {
    expressionEl.textContent = pretty(expression) || "0";
  }

  function showError(message) {
    errorBar.textContent = message;
    errorBar.hidden = false;
  }

  function clearError() {
    errorBar.hidden = true;
    errorBar.textContent = "";
  }

  // ---------- 输入 ----------
  function appendValue(value) {
    clearError();
    // 若上一步刚完成计算且输入的是数字，则开始新的表达式
    if (lastResult !== null && /[0-9.]/.test(value)) {
      expression = "";
    }
    lastResult = null;
    expression += value;
    render();
  }

  function backspace() {
    clearError();
    expression = expression.slice(0, -1);
    lastResult = null;
    render();
  }

  function clearAll() {
    clearError();
    expression = "";
    lastResult = null;
    resultEl.textContent = "0";
    render();
  }

  // ---------- 计算（核心：请求后端完成） ----------
  async function equals() {
    clearError();
    if (!expression.trim()) {
      showError("请输入表达式");
      return;
    }
    try {
      const data = await api.calculate(expression);
      if (data.success) {
        resultEl.textContent = data.result;
        lastResult = data.result;
        expression = String(data.result);
        render();
        await refreshHistory();
      } else {
        showError(data.message || "计算失败");
      }
    } catch (err) {
      showError("无法连接后端服务，请检查后端是否已启动");
    }
  }

  // ---------- 历史 ----------
  function renderHistory(items) {
    historyCount.textContent = items.length;
    if (items.length === 0) {
      historyList.innerHTML = '<li class="history-empty">暂无记录</li>';
      return;
    }
    historyList.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "history-item";

      const body = document.createElement("div");
      body.className = "history-body";
      body.innerHTML =
        `<div class="history-expr">${escapeHtml(pretty(item.expression))}</div>` +
        `<div class="history-meta">= ${escapeHtml(String(item.result))} · ${escapeHtml(item.created_at)}</div>`;
      body.addEventListener("click", () => {
        expression = item.expression;
        lastResult = null;
        render();
      });

      const delBtn = document.createElement("button");
      delBtn.className = "icon-btn danger";
      delBtn.title = "删除该记录";
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", () => deleteItem(item.id));

      li.appendChild(body);
      li.appendChild(delBtn);
      historyList.appendChild(li);
    });
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  async function refreshHistory() {
    try {
      const data = await api.getHistory();
      if (data.success) {
        renderHistory(data.history);
        setConnection(true);
      }
    } catch (err) {
      setConnection(false);
    }
  }

  async function deleteItem(id) {
    try {
      const data = await api.deleteHistory(id);
      if (!data.success) {
        showError(data.message || "删除失败");
      }
      await refreshHistory();
    } catch (err) {
      showError("删除失败：无法连接后端服务");
    }
  }

  async function clearAllHistory() {
    if (!window.confirm("确定要清空全部计算历史吗？")) return;
    try {
      await api.clearHistory();
      await refreshHistory();
    } catch (err) {
      showError("清空失败：无法连接后端服务");
    }
  }

  // ---------- 连接状态 ----------
  function setConnection(ok) {
    connStatus.textContent = ok ? "已连接" : "未连接";
    connStatus.classList.toggle("ok", ok);
    connStatus.classList.toggle("bad", !ok);
  }

  // ---------- 主题 ----------
  function initTheme() {
    const saved = localStorage.getItem("theme") || "light";
    document.body.dataset.theme = saved;
    themeToggle.textContent = saved === "dark" ? "☀️" : "🌙";
  }

  themeToggle.addEventListener("click", () => {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    localStorage.setItem("theme", next);
    themeToggle.textContent = next === "dark" ? "☀️" : "🌙";
  });

  // ---------- 事件绑定 ----------
  document.querySelectorAll(".key").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const value = btn.dataset.value;
      if (action === "clear") clearAll();
      else if (action === "backspace") backspace();
      else if (action === "equals") equals();
      else if (value !== undefined) appendValue(value);
    });
  });

  // 键盘快捷键（扩展功能）
  document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (/^[0-9.+\-*/()]$/.test(key)) {
      appendValue(key);
    } else if (key === "Enter" || key === "=") {
      event.preventDefault();
      equals();
    } else if (key === "Backspace") {
      backspace();
    } else if (key === "Escape") {
      clearAll();
    }
  });

  clearAllBtn.addEventListener("click", clearAllHistory);

  apiBaseInput.value = getApiBase();
  saveApiBtn.addEventListener("click", () => {
    setApiBase(apiBaseInput.value.trim());
    apiBaseInput.value = getApiBase();
    refreshHistory();
  });

  // ---------- 初始化 ----------
  initTheme();
  render();
  refreshHistory();
})();
