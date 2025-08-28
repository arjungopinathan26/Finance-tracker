const express = require('express');
const router = express.Router();
const Expense = require('../models/expense.model');
const auth = require('../middleware/auth');

// Add Expense 
router.post('/', auth, async (req, res) => {
  const { category, amount } = req.body;
  try {
    const expense = new Expense({ userId: req.userId, category, amount });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Get Expenses
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId });
    res.json(expenses);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update Expense
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).send('Expense not found');
    res.json(updated);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete Expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).send('Expense not found');
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;