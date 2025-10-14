import { useState, useEffect } from 'react';
import api from '../utils/api';

const IncomeExpenseSummary = ({ refresh }) => {
  const [data, setData] = useState({ income: 0, expense: 0, net: 0 });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/dashboard/income-vs-expense');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching income/expense data:', error);
      setData({ income: 0, expense: 0, net: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">This Month's Summary</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{formatCurrency(data.income)}</p>
          <p className="text-sm text-gray-500">Income</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">{formatCurrency(data.expense)}</p>
          <p className="text-sm text-gray-500">Expenses</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${data.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(data.net)}
          </p>
          <p className="text-sm text-gray-500">Net</p>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseSummary;