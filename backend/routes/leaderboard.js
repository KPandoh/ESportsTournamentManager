const express = require('express');
const router = express.Router();
const db = require('../db');

// Get leaderboard (ranked by KD ratio)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.player_id,
        p.player_name, 
        p.real_name,
        p.agent_name,
        p.agent_image,
        MAX(pts.total_kills) as kills, 
        MAX(pts.total_deaths) as deaths, 
        MAX(pts.kd_ratio) as kd_ratio,
        t.team_name,
        t.logo_url
      FROM player_tournament_stats pts
      JOIN players p ON pts.player_id = p.player_id
      LEFT JOIN teams t ON p.team_id = t.team_id
      GROUP BY p.player_id, p.player_name, p.real_name, p.agent_name, p.agent_image, t.team_name, t.logo_url
      ORDER BY kd_ratio DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
