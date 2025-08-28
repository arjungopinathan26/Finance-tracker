import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState(null);

  const categories = [
    'Housing',
    'Food',
    'Utilities',
    'Transportation',
    'Healthcare',
    'Debt Payments',
    'Insurance',
    'Education',
    'Childcare/Dependent Care',
    'Basic Personal Care',
    'Other'
  ];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/expense', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const finalCategory = category === 'Other' ? customCategory : category;

    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:5050/api/expense/${editingId}`,
          { category: finalCategory, amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenses(expenses.map((exp) => (exp._id === editingId ? res.data : exp)));
        setEditingId(null);
      } else {
        const res = await axios.post(
          'http://localhost:5050/api/expense',
          { category: finalCategory, amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExpenses([...expenses, res.data]);
      }

      setCategory('');
      setCustomCategory('');
      setAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (expense) => {
    setCategory(categories.includes(expense.category) ? expense.category : 'Other');
    setCustomCategory(categories.includes(expense.category) ? '' : expense.category);
    setAmount(expense.amount);
    setEditingId(expense._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Expenses</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full p-4 mb-2 border rounded"
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          {category === 'Other' && (
            <input
              type="text"
              placeholder="Enter Custom Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="block w-full p-2 mb-2 border rounded"
              required
            />
          )}

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingId ? 'Update Expense' : 'Add Expense'}
          </button>
        </form>

        <ul>
          {expenses.map((expense) => (
            <li key={expense._id} className="mb-2 flex justify-between items-center">
              <span>{expense.category}: ₹{expense.amount}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(expense)}
                  className="bg-yellow-400 px-2 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="bg-red-500 px-2 py-1 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Expenses;
