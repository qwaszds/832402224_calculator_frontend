# Front-End Code Standard (codestyle.md)

## Source of the Standard

The front end is written in vanilla JavaScript. This code standard is based on the **Google JavaScript Style Guide**, with best practices from the **Airbnb JavaScript Style Guide**.

- Google JavaScript Style Guide: <https://google.github.io/styleguide/jsguide.html>
- Airbnb JavaScript Style Guide: <https://github.com/airbnb/javascript>

## 1. Code Layout

- Indentation: **2 spaces**, never tabs.
- Maximum line length: **100 characters**; wrap and align when exceeded.
- Statements end with **semicolons**.
- Braces use the 1TBS style (opening brace on the same line):
  ```js
  if (condition) {
    doSomething();
  } else {
    doOther();
  }
  ```
- Spaces around operators and after commas.

## 2. Naming

| Type | Style | Example |
| --- | --- | --- |
| Variable / function | camelCase | `expression`, `refreshHistory` |
| Constant | UPPER_CASE | `DEFAULT_API_BASE` |
| Class | PascalCase | `ApiError` |
| File name | lower case | `app.js`, `config.js` |

- Variable names must be descriptive; meaningless names like `a`, `b`, `tmp1` are forbidden (loop counters excepted).
- Boolean variables should start with `is` / `has` / `can`.

## 3. Language Rules

- Use `const` / `let`; `var` is forbidden.
- Use `===` / `!==`; `==` / `!=` are forbidden.
- Use template literals for string concatenation: `` `${getApiBase()}/api/history` ``.
- Use arrow functions for callbacks; named functions use the `function` declaration.
- Handle asynchrony with `async` / `await`; avoid deep Promise chains.
- Never use `eval`, `new Function` or any other dynamic code execution.

## 4. Comments and Documentation

- Every `.js` file starts with a block comment describing its responsibility.
- Public functions use JSDoc-style comments with parameters and return values:
  ```js
  /**
   * Submit an expression to the back end for calculation.
   * @param {string} expression
   * @returns {Promise<Object>}
   */
  ```
- Key business logic (front-end / back-end interaction, DOM rendering) needs inline comments explaining the design intent.

## 5. DOM and Events

- DOM manipulation uses standard APIs (`document.getElementById`, `document.createElement`, ...).
- User input rendered into the page must be **HTML-escaped** (see `escapeHtml` in the project) to prevent XSS.
- Event handlers stay short and single-purpose; extract complex logic into functions.

## 6. Error Handling

- Every `fetch` call is wrapped in `try / catch`; network failures show a friendly message.
- When the back end returns `success: false`, the `message` must be displayed; silent failure is forbidden.

## 7. Formatting and Linting

Recommended:

```bash
npm install --save-dev eslint prettier
npx eslint src/js/
npx prettier --write src/
```

## 8. Other Conventions

- Separate concerns: HTML / CSS / JS live in their own files; no inline scripts or styles in HTML.
- UI text, code comments and identifiers all use English.
- Commit messages use the English imperative mood, e.g. `Add keyboard shortcuts`.
