import { useState } from 'react';
import Navbar from '../components/Navbar';
import PlaidLink from '../components/PlaidLink';
import AccountsList from '../components/AccountsList';
import TransactionsList from '../components/TransactionsList';
import SpendingChart from '../components/SpendingChart';
import MonthlyChart from '../components/MonthlyChart';
import BudgetManager from '../components/BudgetManager';
import IncomeExpenseSummary from '../components/IncomeExpenseSummary';
import TransactionManager from '../components/TransactionManager';

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Personal Finance Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Track your finances and manage your budget
                </p>
              </div>
              <div className="flex-shrink-0">
                <PlaidLink onSuccess={handlePlaidSuccess} />
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-8">
            <IncomeExpenseSummary refresh={refreshKey} />
          </div>

          {/* Charts Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <SpendingChart refresh={refreshKey} />
              <MonthlyChart refresh={refreshKey} />
            </div>
          </div>

          {/* Accounts and Transactions Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Accounts & Transactions</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AccountsList refresh={refreshKey} />
              <TransactionsList refresh={refreshKey} />
            </div>
          </div>

          {/* Management Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Manage</h2>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <BudgetManager refresh={refreshKey} />
              <TransactionManager refresh={refreshKey} onUpdate={handlePlaidSuccess} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;