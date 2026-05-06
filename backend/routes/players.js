const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Get all players (with team name)
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT p.*, t.team_name, t.logo_url 
      FROM players p 
      LEFT JOIN teams t ON p.team_id = t.team_id
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT p.*, t.team_name 
      FROM players p 
      LEFT JOIN teams t ON p.team_id = t.team_id 
      WHERE p.player_id = ?
    `;
    const [rows] = await db.query(query, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Player not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create player
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { player_name, real_name, age, country, team_id } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO players (player_name, real_name, age, country, team_id) VALUES (?, ?, ?, ?, ?)',
      [player_name, real_name, age, country, team_id]
    );
    res.status(201).json({ id: result.insertId, player_name, real_name, age, country, team_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update player
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { player_name, real_name, age, country, team_id } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE players SET player_name = ?, real_name = ?, age = ?, country = ?, team_id = ? WHERE player_id = ?',
      [player_name, real_name, age, country, team_id, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Player not found' });
    res.json({ message: 'Player updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete player
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM players WHERE player_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Player not found' });
    res.json({ message: 'Player deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
