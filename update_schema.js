const mysql = require('mysql2/promise');

async function updateSchema() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'CodeRoot@07',
      database: 'ESports_Tournament'
    });

    console.log('Connected to DB...');

    // 1. Add logo_url to teams
    try {
      await connection.query('ALTER TABLE teams ADD COLUMN logo_url VARCHAR(255) DEFAULT "/logos/default.png"');
      console.log('Added logo_url to teams.');
    } catch(err) {
      if(err.code === 'ER_DUP_FIELDNAME') console.log('logo_url already exists.');
      else throw err;
    }

    // 2. Add agent_name and agent_image to players
    try {
      await connection.query('ALTER TABLE players ADD COLUMN agent_name VARCHAR(100) DEFAULT "Jett"');
      await connection.query('ALTER TABLE players ADD COLUMN agent_image VARCHAR(255) DEFAULT "/agents/default.png"');
      console.log('Added agent columns to players.');
    } catch(err) {
      if(err.code === 'ER_DUP_FIELDNAME') console.log('agent columns already exist.');
      else throw err;
    }

    // Assign some specific agents to top players to test the UI
    const agents = ['Jett', 'Reyna', 'Omen', 'Phoenix', 'Killjoy', 'Viper', 'Cypher', 'Sova'];
    const [players] = await connection.query('SELECT player_id FROM players');
    
    for (let i = 0; i < players.length; i++) {
        const agentName = agents[i % agents.length];
        await connection.query('UPDATE players SET agent_name = ?, agent_image = ? WHERE player_id = ?', [
            agentName,
            `/agents/${agentName.toLowerCase()}.png`,
            players[i].player_id
        ]);
    }
    console.log('Assigned placeholder agents to players.');

    // Assign logos to top 3 teams based on leaderboard
    const [teams] = await connection.query('SELECT team_id FROM teams LIMIT 10');
    for (let i = 0; i < teams.length; i++) {
        await connection.query('UPDATE teams SET logo_url = ? WHERE team_id = ?', [
            `/logos/team${i+1}.png`,
            teams[i].team_id
        ]);
    }
    console.log('Assigned placeholder logos to teams.');

    await connection.end();
    console.log('Database update complete.');
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

updateSchema();
