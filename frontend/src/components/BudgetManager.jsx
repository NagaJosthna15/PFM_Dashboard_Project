import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const categories = [
  'Food and Drink',
  'Transportation', 
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Other'
];

const BudgetManager = ({ refresh }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ category: '', amount: '' });

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/budgets');
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/budgets', formData);
      toast.success('Budget saved successfully');
      setFormData({ category: '', amount: '' });
      setShowForm(false);
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to save budget');
    }
  };

  const handleDelete = async (budgetId) => {
    try {
      await api.delete(`/api/budgets/${budgetId}`);
      toast.success('Budget deleted');
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Monthly Budgets</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
        >
          {showForm ? 'Cancel' : 'Add Budget'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Budget Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="border rounded px-3 py-2"
              required
              min="0"
              step="0.01"
            />
          </div>
          <button
            type="submit"
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Save Budget
          </button>
        </form>
      )}

      <div className="space-y-3">
        {budgets.length === 0 ? (
          <p className="text-gray-500 text-center">No budgets set for this month.</p>
        ) : (
          budgets.map((budget) => (
            <div key={budget._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{budget.category}</span>
                <span className="text-gray-500 ml-2">${budget.amount}</span>
              </div>
              <button
                onClick={() => handleDelete(budget._id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetManager;