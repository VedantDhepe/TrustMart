const pool = require('../db');

// async function listStores({ search = '', userId }) {
//   const searchClause = search
//     ? `AND (LOWER(s.name) LIKE $2 OR LOWER(s.address) LIKE $2)`
//     : '';
//   const values = [userId];
//   if (search) values.push(`%${search.toLowerCase()}%`);

//   const query = `
//     SELECT
//       s.id, s.name, s.email, s.address,
//       COALESCE(avg(r.rating), 0)::decimal(2,1) AS avg_rating,
//       ur.rating AS user_rating
//     FROM stores s
//     LEFT JOIN ratings r ON r.store_id = s.id
//     LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $1
//     WHERE s.owner_id = $1  -- 🔥 restrict to logged-in owner's stores
//     ${searchClause}
//     GROUP BY s.id, ur.rating
//     ORDER BY s.name ASC
//   `;
//   const { rows } = await pool.query(query, values);
//   return rows;
// }----> old one query







// Return all stores with per-store avg_rating and *this user's* rating (or null)
async function listStores({ userId, search = '', sortBy = 'name', order = 'ASC' }) {
  let query = `
    SELECT
      s.id,
      s.name,
      s.address,
      COALESCE(AVG(r.rating), 0)::DECIMAL(2,1) AS avg_rating,
      ur.rating::INT AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id          -- for overall avg
    LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $1 -- current user's rating (if any)
    WHERE 1=1
  `;
  const values = [userId];
  let idx = 2;

  // Optional search
  if (search) {
    query += ` AND (LOWER(s.name) LIKE $${idx} OR LOWER(s.address) LIKE $${idx})`;
    values.push(`%${search.toLowerCase()}%`);
    idx++;
  }

  // Sorting whitelist for safety
  const allowedSort = ['name', 'address', 'avg_rating'];
  if (!allowedSort.includes(sortBy)) sortBy = 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  query += ` GROUP BY s.id, ur.rating ORDER BY ${sortBy} ${sortOrder}`;

  const { rows } = await pool.query(query, values);
  return rows;
}





async function createStore({ name, email, address, owner_id }) {
  const query = `
    INSERT INTO stores (name, email, address, owner_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, address
  `;
  const values = [name, email, address, owner_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
}







async function adminListStores({ search = '', sortBy = 'name', order = 'ASC' }) {
  let query = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      s.owner_id,
      COALESCE(ROUND(AVG(r.rating), 2), 0) AS avg_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE 1=1
  `;
  let values = [];
  let idx = 1;

  if (search) {
    query += ` AND (LOWER(s.name) LIKE $${idx} OR LOWER(s.email) LIKE $${idx} OR LOWER(s.address) LIKE $${idx})`;
    values.push(`%${search.toLowerCase()}%`);
    idx++;
  }

  // Make sure allowedSort and sortBy are exactly correct (prefix with s. if needed)
  const allowedSort = ['name', 'email', 'address'];
  if (!allowedSort.includes(sortBy)) sortBy = 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  // *** The fix is below ***
  query += `
    GROUP BY s.id, s.name, s.email, s.address, s.owner_id
    ORDER BY s.${sortBy} ${sortOrder}
  `;

  const { rows } = await pool.query(query, values);
  return rows;
}









async function updateStore(storeId, { name, email, address }, ownerId = null, isAdmin = false) {
  let query, values;
  if (isAdmin) {
    query = `UPDATE stores SET name=$1, email=$2, address=$3 WHERE id=$4 RETURNING *`;
    values = [name, email, address, storeId];
  } else {
    query = `UPDATE stores SET name=$1, email=$2, address=$3 WHERE id=$4 AND owner_id=$5 RETURNING *`;
    values = [name, email, address, storeId, ownerId];
  }
  const { rows } = await pool.query(query, values);
  return rows[0];
}

// Delete store
async function deleteStore(storeId, ownerId = null, isAdmin = false) {
  let query, values;
  if (isAdmin) {
    query = `DELETE FROM stores WHERE id=$1 RETURNING id`;
    values = [storeId];
  } else {
    query = `DELETE FROM stores WHERE id=$1 AND owner_id=$2 RETURNING id`;
    values = [storeId, ownerId];
  }
  const { rows } = await pool.query(query, values);
  return rows[0];
}

module.exports={listStores, createStore, adminListStores, updateStore, deleteStore}









