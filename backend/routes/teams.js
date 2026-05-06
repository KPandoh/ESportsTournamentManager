const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Get all teams
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM teams');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM teams WHERE team_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Team not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create team
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { team_name, region, coach_name } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO teams (team_name, region, coach_name) VALUES (?, ?, ?)',
      [team_name, region, coach_name]
    );
    res.status(201).json({ id: result.insertId, team_name, region, coach_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update team
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { team_name, region, coach_name } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE teams SET team_name = ?, region = ?, coach_name = ? WHERE team_id = ?',
      [team_name, region, coach_name, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete team
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM teams WHERE team_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Team not found' });
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error (might be referenced by players/matches)' });
  }
});

module.exports = router;
