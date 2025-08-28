const express = require('express');
const router = express.Router();
const Savings = require('../models/saving.model');
const auth = require('../middleware/auth');

// Add Savings Goal
router.post('/', auth, async (req, res) => {
  const { goal, targetAmount } = req.body;
  try {
    const savings = new Savings({ userId: req.userId, goal, targetAmount });
    await savings.save();
    res.status(201).json(savings);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get Savings Goals
router.get('/', auth, async (req, res) => {
  try {
    const savings = await Savings.find({ userId: req.userId });
    res.json(savings);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update Saving Goal
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Savings.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).send('Saving goal not found');
    res.json(updated);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete Saving Goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Savings.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).send('Saving goal not found');
    res.json({ message: 'Saving goal deleted successfully' });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;