const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tournaments');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create tournament
router.post('/', async (req, res) => {
  const { tournament_name, season, location, start_date, end_date } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO tournaments (tournament_name, season, location, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
      [tournament_name, season, location, start_date, end_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Tournament created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete tournament
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM tournaments WHERE tournament_id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Tournament not found' });
    res.json({ message: 'Tournament deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
