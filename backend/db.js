const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'CodeRoot@07',
  database: 'ESports_Tournament',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL Database connected successfully.');
    conn.release();
  })
  .catch(err => {
    console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    console.error('Please update your MySQL username and password in backend/db.js');
  });

module.exports = pool;
