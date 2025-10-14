import { useState } from 'react';
import Navbar from '../components/Navbar';
import PlaidLink from '../components/PlaidLink';
import AccountsList from '../components/AccountsList';
import TransactionsList from '../components/TransactionsList';
import SpendingChart from '../components/SpendingChart';
import MonthlyChart from '../components/MonthlyChart';
import BudgetManager from '../components/BudgetManager';
import IncomeExpenseSummary from '../components/IncomeExpenseSummary';

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePlaidSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Personal Finance Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Connect your bank accounts to get started
                </p>
              </div>
              <PlaidLink onSuccess={handlePlaidSuccess} />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-6">
            <IncomeExpenseSummary refresh={refreshKey} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SpendingChart refresh={refreshKey} />
            <MonthlyChart refresh={refreshKey} />
          </div>

          {/* Accounts and Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AccountsList refresh={refreshKey} />
            <TransactionsList refresh={refreshKey} />
          </div>

          {/* Budget Management */}
          <div className="mb-6">
            <BudgetManager refresh={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;