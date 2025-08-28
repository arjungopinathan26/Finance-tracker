import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const categories = [
  'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Travel', 'Education', 'Other'
];

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5050/api/budget', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBudgets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const finalCategory = category === 'custom' ? customCategory : category;

    try {
      if (editingId) {
        const res = await axios.put(
          `http://localhost:5050/api/budget/${editingId}`,
          { category: finalCategory, limit },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBudgets(budgets.map(b => b._id === editingId ? res.data : b));
        setEditingId(null);
      } else {
        const res = await axios.post(
          'http://localhost:5050/api/budget',
          { category: finalCategory, limit },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBudgets([...budgets, res.data]);
      }
      setCategory('');
      setCustomCategory('');
      setLimit('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (budget) => {
    setCategory(categories.includes(budget.category) ? budget.category : 'custom');
    setCustomCategory(!categories.includes(budget.category) ? budget.category : '');
    setLimit(budget.limit);
    setEditingId(budget._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(budgets.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Budgets</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="custom">Other (Enter manually)</option>
          </select>

          {category === 'custom' && (
            <input
              type="text"
              placeholder="Custom Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="block w-full p-2 mb-2 border rounded"
            />
          )}

          <input
            type="number"
            placeholder="Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingId ? 'Update Budget' : 'Set Budget'}
          </button>
        </form>
        <ul>
          {budgets.map((budget) => (
            <div key={budget._id}>
              <li className="">
                {budget.category}: ₹{budget.limit}
                <div className='flex justify-end'>
                  <button
                    onClick={() => handleEdit(budget)}
                    className="ml-2 px-2 py-1 bg-yellow-400 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Budget;
