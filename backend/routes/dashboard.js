const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [teams] = await db.query('SELECT COUNT(*) as count FROM teams');
    const [players] = await db.query('SELECT COUNT(*) as count FROM players');
    const [tournaments] = await db.query('SELECT COUNT(*) as count FROM tournaments');
    const [matches] = await db.query('SELECT COUNT(*) as count FROM matches');

    // Top player by KD
    const [topPlayer] = await db.query('SELECT player_name, MAX(kd_ratio) as kd_ratio FROM player_tournament_stats GROUP BY player_name ORDER BY kd_ratio DESC LIMIT 1');
    
    // Top team by wins/points
    const [topTeam] = await db.query('SELECT team_name, MAX(wins) as wins FROM team_standings GROUP BY team_name ORDER BY MAX(points) DESC, wins DESC LIMIT 1');

    // Matches over time (group by date)
    const [matchesOverTime] = await db.query(`
      SELECT DATE_FORMAT(match_date, '%Y-%m-%d') as date, COUNT(*) as count 
      FROM matches 
      GROUP BY match_date 
      ORDER BY match_date ASC
    `);

    // Top 5 players for KD graph
    const [topPlayersGraph] = await db.query('SELECT player_name, MAX(kd_ratio) as kd_ratio FROM player_tournament_stats GROUP BY player_name ORDER BY kd_ratio DESC LIMIT 5');

    res.json({
      stats: {
        totalTeams: teams[0].count,
        totalPlayers: players[0].count,
        totalTournaments: tournaments[0].count,
        totalMatches: matches[0].count
      },
      topPlayer: topPlayer[0] || null,
      topTeam: topTeam[0] || null,
      graphs: {
        matchesOverTime,
        topPlayers: topPlayersGraph
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
