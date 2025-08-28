import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Income = () => {
  const [income, setIncome] = useState([]);
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/income', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncome(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (editingId) {
        // Update income
        const res = await axios.put(
          `http://localhost:5050/api/income/${editingId}`,
          { source, amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIncome(income.map((i) => (i._id === editingId ? res.data : i)));
        setEditingId(null);
      } else {
        // Add income
        const res = await axios.post(
          'http://localhost:5050/api/income',
          { source, amount },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIncome([...income, res.data]);
      }

      setSource('');
      setAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (entry) => {
    setSource(entry.source);
    setAmount(entry.amount);
    setEditingId(entry._id);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/income/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncome(income.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Income</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingId ? 'Update Income' : 'Add Income'}
          </button>
        </form>

        <ul>
          {income.map((i) => (
            <li key={i._id} className="mb-2 flex justify-between items-center">
              <span>{i.source}: ₹{i.amount}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(i)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(i._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
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

export default Income;