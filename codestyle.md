# 前端代码规范（codestyle.md）

## 规范来源

本项目前端使用原生 JavaScript 编写，代码规范以 **Google JavaScript Style Guide** 为基准，并参考 **Airbnb JavaScript Style Guide** 的最佳实践。

- Google JavaScript Style Guide: <https://google.github.io/styleguide/jsguide.html>
- Airbnb JavaScript Style Guide: <https://github.com/airbnb/javascript>

## 1. 代码布局

- 缩进：**2 个空格**，禁止使用 Tab。
- 每行最大长度：**100 字符**，超长时换行对齐。
- 语句末尾必须写**分号**。
- 大括号采用 1TBS 风格（左括号不换行）：
  ```js
  if (condition) {
    doSomething();
  } else {
    doOther();
  }
  ```
- 操作符两侧、逗号后加空格。

## 2. 命名规范

| 类型 | 风格 | 示例 |
| --- | --- | --- |
| 变量 / 函数 | 小驼峰（camelCase） | `expression`、`refreshHistory` |
| 常量 | 全大写 + 下划线 | `DEFAULT_API_BASE` |
| 类名 | 大驼峰（PascalCase） | `ApiError` |
| 文件名 | 全小写 | `app.js`、`config.js` |

- 变量命名应具有描述性，禁止 `a`、`b`、`tmp1` 等无意义命名（循环计数器除外）。
- 布尔变量建议以 `is` / `has` / `can` 开头。

## 3. 语言规范

- 使用 `const` / `let`，禁止使用 `var`。
- 优先使用 `===` / `!==`，禁止 `==` / `!=`。
- 使用模板字符串拼接字符串：`` `${getApiBase()}/api/history` ``。
- 使用箭头函数作为回调；具名函数使用 `function` 声明。
- 使用 `async` / `await` 处理异步，避免过深的 Promise 链。
- 禁止使用 `eval`、`new Function` 等动态执行代码的方式。

## 4. 注释与文档

- 每个 `.js` 文件顶部必须有块注释，说明该文件职责。
- 公共函数使用 JSDoc 风格注释，标注参数与返回值：
  ```js
  /**
   * 提交表达式到后端计算。
   * @param {string} expression
   * @returns {Promise<Object>}
   */
  ```
- 关键业务逻辑（如前后端交互、DOM 渲染）需附行内注释说明设计意图。

## 5. DOM 与事件

- DOM 操作使用 `document.getElementById` / `document.createElement` 等标准 API。
- 用户输入渲染到页面时必须进行 **HTML 转义**（项目中 `escapeHtml`），防止 XSS。
- 事件处理函数应短小、职责单一，复杂逻辑拆分为独立函数。

## 6. 错误处理

- 所有 `fetch` 请求必须 `try / catch`，网络异常给用户友好提示。
- 后端返回的 `success: false` 必须展示 `message`，不得静默失败。

## 7. 格式化与检查工具

推荐：

```bash
npm install --save-dev eslint prettier
npx eslint src/js/
npx prettier --write src/
```

## 8. 其他约定

- 样式与逻辑分离：HTML / CSS / JS 各自独立文件，不在 HTML 中内联脚本与样式。
- 界面文案使用中文，代码注释使用中文，标识符使用英文。
- 提交信息（commit message）使用英文祈使句，如 `Add keyboard shortcuts`。
