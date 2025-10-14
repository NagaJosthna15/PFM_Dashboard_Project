import { usePlaidLink } from 'react-plaid-link';
import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PlaidLink = ({ onSuccess }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const createLinkToken = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/create_link_token');
      setLinkToken(response.data.linkToken);
    } catch (error) {
      toast.error('Failed to create link token');
      console.error('Error creating link token:', error);
    } finally {
      setLoading(false);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (publicToken, metadata) => {
      try {
        const response = await api.post('/api/exchange_public_token', {
          publicToken
        });
        
        toast.success('Bank account connected successfully!');
        onSuccess && onSuccess(response.data);
      } catch (error) {
        toast.error('Failed to connect bank account');
        console.error('Error exchanging public token:', error);
      }
    },
    onExit: (err, metadata) => {
      if (err) {
        console.error('Plaid Link error:', err);
      }
    },
  });

  const handleConnect = () => {
    if (!linkToken) {
      createLinkToken();
    } else if (ready) {
      open();
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading || (linkToken && !ready)}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
    >
      {loading ? 'Loading...' : 'Connect Bank Account'}
    </button>
  );
};

export default PlaidLink;