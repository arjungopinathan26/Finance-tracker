import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Signup from './pages/Signup';
import Budget from './pages/Budget';
import Savings from './pages/Savings';
import Insights from './components/Insights';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/income" element={<Income />} />
        <Route path="/budgets" element={<Budget />} />
        <Route path="/savings" element={<Savings/>} />
        <Route path="/insights" element={<Insights/>}/>
      </Routes>
    </Router>
  );
};

export default App;