const mysql = require('mysql2/promise');

async function checkConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'ESports_Tournament'
    });
    console.log('SUCCESS');
    await connection.end();
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

checkConnection();
