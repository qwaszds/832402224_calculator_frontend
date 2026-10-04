/**
 * 后端 API 封装：所有计算与历史操作都通过网络请求完成，
 * 前端不进行任何表达式求值。
 */
const api = {
  /**
   * 提交表达式到后端计算。
   * @param {string} expression
   * @returns {Promise<{success: boolean, expression?: string, result?: number, message?: string}>}
   */
  async calculate(expression) {
    const resp = await fetch(`${getApiBase()}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expression }),
    });
    return resp.json();
  },

  /** 查询全部计算历史。 */
  async getHistory() {
    const resp = await fetch(`${getApiBase()}/api/history`);
    return resp.json();
  },

  /** 删除指定历史记录。 */
  async deleteHistory(id) {
    const resp = await fetch(`${getApiBase()}/api/history/${id}`, {
      method: "DELETE",
    });
    return resp.json();
  },

  /** 清空全部历史记录（扩展功能）。 */
  async clearHistory() {
    const resp = await fetch(`${getApiBase()}/api/history`, {
      method: "DELETE",
    });
    return resp.json();
  },
};
