const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function createUsersTable() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'CodeRoot@07',
      database: 'ESports_Tournament'
    });

    console.log('Connected to DB...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table ready.');

    // Check if admin exists
    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin']
      );
      console.log('Admin user created (username: admin, password: admin123).');
    } else {
      console.log('Admin user already exists.');
    }

    await connection.end();
    console.log('Database update complete.');
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

createUsersTable();
