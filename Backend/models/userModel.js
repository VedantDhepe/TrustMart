const pool = require('../db');




async function createUser({ name, email, address, password, role }) {
  const query = `
    INSERT INTO users (name, email, address, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, email, address, role
  `;
  const values = [name, email, address, password, role]; // hash password before calling!
  const { rows } = await pool.query(query, values);
  return rows[0];
}




// List/filter users with search and sorting
async function listUsers({ search = '', role = '', sortBy = 'name', order = 'ASC' }) {
  let query = `SELECT id, name, email, address, role FROM users WHERE 1=1`;
  let values = [];
  let idx = 1;

  if (search) {
    query += ` AND (LOWER(name) LIKE $${idx} OR LOWER(email) LIKE $${idx} OR LOWER(address) LIKE $${idx})`;
    values.push(`%${search.toLowerCase()}%`);
    idx++;
  }

  if (role) {
    query += ` AND role = $${idx}`;
    values.push(role);
    idx++;
  }

  const allowedSort = ['name', 'email', 'role', 'address'];
  if (!allowedSort.includes(sortBy)) sortBy = 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  query += ` ORDER BY ${sortBy} ${sortOrder}`;

  const { rows } = await pool.query(query, values);
  return rows;
}



 async function getUserById(userId) {
  const query = "SELECT * FROM users WHERE id = $1";
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
}




async function updatePassword(userId, hashedPassword) {
  const query = `UPDATE users SET password = $1 WHERE id = $2 RETURNING id, email, name, address, role`;
  const values = [hashedPassword, userId];
  const { rows } = await pool.query(query, values);
  return rows[0];
}





async function updateUser(userId, { name, email, address, role }) {
  const query = `
    UPDATE users
    SET name = $1, email = $2, address = $3, role = $4
    WHERE id = $5
    RETURNING id, name, email, address, role
  `;
  const values = [name, email, address, role, userId];
  const { rows } = await pool.query(query, values);
  return rows[0];
}




// Delete user
async function deleteUser(userId) {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
}




module.exports = { createUser, listUsers, getUserById, updatePassword, updateUser, deleteUser};
