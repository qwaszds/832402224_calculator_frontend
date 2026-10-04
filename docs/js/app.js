/**
 * UI interaction logic: button input, keyboard input, requests to the
 * back end, rendering of results and history.
 * Note: this file contains no expression evaluation logic at all;
 * every result comes back from the back end.
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

  // ---------- Display ----------
  /** Render the internal expression (* /) with display symbols (x /). */
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

  // ---------- Input ----------
  function appendValue(value) {
    clearError();
    // Right after a calculation, typing a digit starts a new expression
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

  // ---------- Calculation (core: handled by the back end) ----------
  async function equals() {
    clearError();
    if (!expression.trim()) {
      showError("Please enter an expression");
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
        showError(data.message || "Calculation failed");
      }
    } catch (err) {
      showError("Cannot connect to the backend. Please make sure it is running.");
    }
  }

  // ---------- History ----------
  function renderHistory(items) {
    historyCount.textContent = items.length;
    if (items.length === 0) {
      historyList.innerHTML = '<li class="history-empty">No records yet</li>';
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
      delBtn.title = "Delete this record";
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
        showError(data.message || "Delete failed");
      }
      await refreshHistory();
    } catch (err) {
      showError("Delete failed: cannot connect to the backend.");
    }
  }

  async function clearAllHistory() {
    if (!window.confirm("Clear all calculation history? Are you sure?")) return;
    try {
      await api.clearHistory();
      await refreshHistory();
    } catch (err) {
      showError("Clear failed: cannot connect to the backend.");
    }
  }

  // ---------- Connection status ----------
  function setConnection(ok) {
    connStatus.textContent = ok ? "Connected" : "Disconnected";
    connStatus.classList.toggle("ok", ok);
    connStatus.classList.toggle("bad", !ok);
  }

  // ---------- Theme ----------
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

  // ---------- Event binding ----------
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

  // Keyboard shortcuts (extended feature)
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

  // ---------- Init ----------
  initTheme();
  render();
  refreshHistory();
})();
