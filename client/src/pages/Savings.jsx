import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Savings = () => {
  const [savings, setSavings] = useState([]);
  const [goal, setGoal] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editGoal, setEditGoal] = useState('');
  const [editTargetAmount, setEditTargetAmount] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  const goalOptions = [
    "Emergency Fund",
    "Vacation",
    "New Car",
    "Home Down Payment",
    "Wedding",
    "Education",
    "Others (Manual Entry)"
  ];

  useEffect(() => {
    const fetchSavings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5050/api/savings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSavings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const finalGoal = goal === "Others (Manual Entry)" ? customGoal : goal;

      const res = await axios.post(
        'http://localhost:5050/api/savings',
        { goal: finalGoal, targetAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavings([...savings, res.data]);
      setGoal('');
      setCustomGoal('');
      setTargetAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5050/api/savings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavings(savings.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (saving) => {
    setEditingId(saving._id);
    setEditGoal(saving.goal);
    setEditTargetAmount(saving.targetAmount);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5050/api/savings/${editingId}`,
        { goal: editGoal, targetAmount: editTargetAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavings(savings.map((s) => (s._id === editingId ? res.data : s)));
      setEditingId(null);
      setEditGoal('');
      setEditTargetAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Savings Goals</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          {/* Goal Dropdown */}
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
          >
            <option value="">Select a Goal</option>
            {goalOptions.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Manual Entry Field */}
          {goal === "Others (Manual Entry)" && (
            <input
              type="text"
              placeholder="Enter your custom goal"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              className="block w-full p-2 mb-2 border rounded"
            />
          )}

          {/* Target Amount */}
          <input
            type="number"
            placeholder="Target Amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="block w-full p-2 mb-2 border rounded"
          />

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Savings Goal
          </button>
        </form>

        {/* Display Savings */}
        <ul>
          {savings.map((saving) => (
            <li key={saving._id} className="mb-2">
              {editingId === saving._id ? (
                <div>
                  <input
                    type="text"
                    value={editGoal}
                    onChange={(e) => setEditGoal(e.target.value)}
                    className="block w-full p-1 border rounded"
                  />
                  <input
                    type="number"
                    value={editTargetAmount}
                    onChange={(e) => setEditTargetAmount(e.target.value)}
                    className="block w-full p-1 border rounded"
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  {saving.goal}: ₹{saving.targetAmount}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleEdit(saving)}
                      className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(saving._id)}
                      className="ml-2 bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Savings;
