const mysql = require('mysql2/promise');

async function checkSchema() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'esports'
    });

    console.log('Connected to esports database successfully.');

    const [tables] = await connection.query('SHOW TABLES');
    console.log('\nTables:');
    for (const row of tables) {
      const tableName = Object.values(row)[0];
      console.log(`- ${tableName}`);
      
      const [columns] = await connection.query(`DESCRIBE \`${tableName}\``);
      console.log(`  Columns:`);
      columns.forEach(col => {
        console.log(`    ${col.Field} (${col.Type})`);
      });
    }

    await connection.end();
  } catch (error) {
    console.error('Database connection or query failed:', error.message);
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('The database "esports" does not exist. Trying without database to list databases...');
      try {
          const connection2 = await mysql.createConnection({
              host: 'localhost',
              user: 'root',
              password: ''
          });
          const [dbs] = await connection2.query('SHOW DATABASES');
          console.log('\nAvailable databases:');
          dbs.forEach(db => console.log(`- ${db.Database}`));
          await connection2.end();
      } catch (err2) {
          console.error('Failed to list databases:', err2.message);
      }
    }
  }
}

checkSchema();
