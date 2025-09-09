const {Pool} = require('pg');
const pool = new Pool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
})
pool.connect().then(()=>console.log("DB connected Successfully"))
.catch((err)=>console.log("Failed to connect DB", err.message));

module.exports = pool;