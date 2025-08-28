import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell, RadialBarChart, RadialBar, PieChart, Pie
} from 'recharts';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [savingsPercentage, setSavingsPercentage] = useState(0);
  const [gaugeLabel, setGaugeLabel] = useState('');
  const [gaugeColor, setGaugeColor] = useState('#2196f3'); // default color

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const expensesRes = await axios.get('http://localhost:5050/api/expense', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const incomeRes = await axios.get('http://localhost:5050/api/income', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const expenseData = expensesRes.data;
      const incomeData = incomeRes.data;

      setExpenses(expenseData);
      setIncome(incomeData);

      const totalExpense = expenseData.reduce((sum, item) => sum + Number(item.amount), 0);
      const totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
      const savings = totalIncome - totalExpense;

      const expensePercentage = Math.round((totalExpense / totalIncome) * 100);
      setSavingsPercentage(100 - expensePercentage);

      // Determine label and color based on expense percentage
      let label = '';
      let color = '';

      if (expensePercentage <= 50) {
        label = 'Excellent';
        color = '#4caf50'; // Green
      } else if (expensePercentage <= 60) {
        label = 'Very Good';
        color = '#8bc34a'; // Light Green
      } else if (expensePercentage <= 70) {
        label = 'Good';
        color = '#ffc107'; // Amber
      } else if (expensePercentage <= 80) {
        label = 'Bad';
        color = '#ff9800'; // Orange
      } else {
        label = 'Poor';
        color = '#f44336'; // Red
      }

      setGaugeLabel(label);
      setGaugeColor(color);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Prepare data for Pie Chart
  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const savings = totalIncome - totalExpense;

  const pieData = [
    { name: 'Income', value: totalIncome, fill: '#4caf50' },
    { name: 'Expenses', value: totalExpense, fill: '#f44336' },
    { name: 'Savings', value: savings, fill: '#2196f3' },
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Expenses Bar Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl mb-2">Expenses</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expenses}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#ff6384" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Savings Gauge Chart */}
          <div className="bg-white p-4 rounded shadow flex flex-col items-center justify-center">
            <h2 className="text-xl mb-4">Savings Gauge</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                innerRadius="80%"
                outerRadius="100%"
                data={[{ name: 'Savings', value: savingsPercentage, fill: gaugeColor }]}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <p className="text-xl mt-2 font-semibold">{savingsPercentage}% Saved</p>
            <p className="text-lg font-bold" style={{ color: gaugeColor }}>{gaugeLabel}</p>
          </div>

          {/* Pie Chart - Income vs Expenses vs Savings */}
          <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
            <h2 className="text-xl mb-2">Income vs Expenses vs Savings</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                {/* Add the Legend here */}
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
