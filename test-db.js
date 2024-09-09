const db = require('./app/services/db'); // Adjust the path as necessary

async function testConnection() {
  try {
    const result = await db.query('SELECT 1');
    console.log('Database connected successfully:', result);
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
}

testConnection();
