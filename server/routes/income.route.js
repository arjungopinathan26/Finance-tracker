const express = require('express');
const router = express.Router();
const Income = require('../models/income.model');
const auth = require('../middleware/auth');

// Add Income
router.post('/', auth, async (req, res) => {
  const { source, amount } = req.body;
  try {
    const income = new Income({ userId: req.userId, source, amount });
    await income.save();
    res.status(201).json(income);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get Income
router.get('/', auth, async (req, res) => {
  try {
    const income = await Income.find({ userId: req.userId });
    res.json(income);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update Income
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).send('Income not found');
    res.json(updated);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete Income
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Income.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).send('Income not found');
    res.json({ message: 'Income deleted successfully' });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;