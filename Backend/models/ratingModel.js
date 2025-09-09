const pool = require('../db');

async function rateStore({ user_id, store_id, rating }) {
  // Upsert rating: insert or update
  const query = `
    INSERT INTO ratings (user_id, store_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, store_id)
    DO UPDATE SET rating = EXCLUDED.rating
    RETURNING *`;
  const values = [user_id, store_id, rating];
  const { rows } = await pool.query(query, values);
  return rows[0];
}



// Get all user ratings for a given store (by owner id)
async function getRatingsForOwner(owner_id) {
  const query = `
    SELECT
      u.id as user_id,
      u.name,
      u.email,
      u.address,
      r.rating,
      r.store_id,
      s.name as store_name
    FROM stores s
    JOIN ratings r ON s.id = r.store_id
    JOIN users u ON u.id = r.user_id
    WHERE s.owner_id = $1
    ORDER BY r.rating DESC
  `;
  const { rows } = await pool.query(query, [owner_id]);
  return rows;
}

// Get average rating for stores owned by a given owner
async function getAverageRatingForOwner(owner_id) {
  const query = `
    SELECT s.id AS store_id, s.name AS store_name, COALESCE(AVG(r.rating),0)::DECIMAL(2,1) AS avg_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE s.owner_id = $1
    GROUP BY s.id, s.name
    ORDER BY s.name ASC
  `;
  const { rows } = await pool.query(query, [owner_id]);
  return rows;
}

module.exports = { getRatingsForOwner, getAverageRatingForOwner, rateStore };
