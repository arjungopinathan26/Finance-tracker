import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold">
          Financial Tracker
        </Link>
        <div>
          <Link to="/dashboard" className="mr-4">
            Dashboard
          </Link>
          <Link to="/insights" className="mr-4">
            Insights
          </Link>
          <Link to="/expenses" className="mr-4">
            Expenses
          </Link>
          <Link to="/income" className="mr-4">
            Income
          </Link>
          <Link to="/budgets" className="mr-4">
            Budgets
          </Link>
          <Link to="/savings" className="mr-4">
            Savings
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;