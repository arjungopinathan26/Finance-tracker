const express = require('express');
const router = express.Router();
const Budget = require('../models/budget.model');
const auth = require('../middleware/auth');

// Set Budget
router.post('/', auth, async (req, res) => {
  const { category, limit } = req.body;
  try {
    const budget = new Budget({ userId: req.userId, category, limit });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get Budgets
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    res.json(budgets);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update Budget
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).send('Budget not found');
    res.json(updated);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete Budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).send('Budget not found');
    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;