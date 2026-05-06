const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all matches with team names and tournament names
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        m.*, 
        t1.team_name as team1_name, t1.logo_url as team1_logo,
        t2.team_name as team2_name, t2.logo_url as team2_logo,
        wt.team_name as winner_name, wt.logo_url as winner_logo,
        tr.tournament_name,
        map_table.map_name
      FROM matches m
      LEFT JOIN teams t1 ON m.team1_id = t1.team_id
      LEFT JOIN teams t2 ON m.team2_id = t2.team_id
      LEFT JOIN teams wt ON m.winner_team_id = wt.team_id
      LEFT JOIN tournaments tr ON m.tournament_id = tr.tournament_id
      LEFT JOIN match_maps mm ON m.match_id = mm.match_id
      LEFT JOIN maps map_table ON mm.map_id = map_table.map_id
      ORDER BY m.match_date DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create match
router.post('/', async (req, res) => {
  const { tournament_id, match_date, team1_id, team2_id, winner_team_id, score_team1, score_team2 } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO matches (tournament_id, match_date, team1_id, team2_id, winner_team_id, score_team1, score_team2) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [tournament_id, match_date, team1_id, team2_id, winner_team_id, score_team1, score_team2]
    );
    res.status(201).json({ id: result.insertId, message: 'Match created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete match
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM matches WHERE match_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Match not found' });
    res.json({ message: 'Match deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
