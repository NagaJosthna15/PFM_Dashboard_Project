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
  'Income',
  'Other'
];

const TransactionManager = ({ refresh, onUpdate }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Other'
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/user-transactions');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/user-transactions/${editingId}`, formData);
        toast.success('Transaction updated');
      } else {
        await api.post('/api/user-transactions', formData);
        toast.success('Transaction added');
      }
      
      setFormData({ name: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'Other' });
      setShowForm(false);
      setEditingId(null);
      fetchTransactions();
      onUpdate && onUpdate();
    } catch (error) {
      toast.error('Failed to save transaction');
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      name: transaction.name,
      amount: Math.abs(transaction.amount).toString(),
      date: transaction.date.split('T')[0],
      category: transaction.category[0] || 'Other'
    });
    setEditingId(transaction._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    
    try {
      await api.delete(`/api/user-transactions/${id}`);
      toast.success('Transaction deleted');
      fetchTransactions();
      onUpdate && onUpdate();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Manage Transactions</h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', amount: '', date: new Date().toISOString().split('T')[0], category: 'Other' });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
        >
          {showForm ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <input
              type="text"
              placeholder="Transaction Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="border rounded px-3 py-2"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border rounded px-3 py-2"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            {editingId ? 'Update' : 'Add'} Transaction
          </button>
        </form>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions found.</p>
        ) : (
          transactions.slice(0, 10).map((transaction) => (
            <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{transaction.name}</span>
                <span className="text-gray-500 ml-2">
                  {formatCurrency(transaction.amount)} • {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(transaction._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionManager;