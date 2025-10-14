import { useState } from 'react';
import Navbar from '../components/Navbar';
import PlaidLink from '../components/PlaidLink';
import AccountsList from '../components/AccountsList';
import TransactionsList from '../components/TransactionsList';

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

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccountsList refresh={refreshKey} />
            <TransactionsList refresh={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;