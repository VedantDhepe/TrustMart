// dashboardController.js
const pool = require('../db');
exports.getTotals = async (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM stores) AS total_stores,
      (SELECT COUNT(*) FROM ratings) AS total_ratings
  `;
  const { rows } = await pool.query(query);
  res.json(rows[0]);
};