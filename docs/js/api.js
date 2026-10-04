/**
 * Backend API wrapper: every calculation and history operation goes
 * through network requests. The front end never evaluates expressions.
 */
const api = {
  /**
   * Submit an expression to the back end for calculation.
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

  /** Query all calculation history. */
  async getHistory() {
    const resp = await fetch(`${getApiBase()}/api/history`);
    return resp.json();
  },

  /** Delete one history record. */
  async deleteHistory(id) {
    const resp = await fetch(`${getApiBase()}/api/history/${id}`, {
      method: "DELETE",
    });
    return resp.json();
  },

  /** Clear all history records (extended feature). */
  async clearHistory() {
    const resp = await fetch(`${getApiBase()}/api/history`, {
      method: "DELETE",
    });
    return resp.json();
  },
};
