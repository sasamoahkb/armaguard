require("dotenv").config();
const mysql = require('mysql2/promise');


const config = {
  db: {
    host: process.env.DB_HOST, // Should be 'db' as per Docker Compose service name
    port: process.env.DB_PORT,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    waitForConnections: true,
  }
};

const pool = mysql.createPool(config.db);

async function query(sql, params) {
  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

// async function testConnection() {
//   try {
//     const result = await query('SELECT 1');
//     console.log('Database connected successfully:', result);
//   } catch (err) {
//     console.error('Failed to connect to the database:', err);
//   }
// }

// testConnection();

module.exports = {
  query
};
