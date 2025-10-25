import express from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';

const router = express.Router();

// Get all transactions for user
router.get('/api/user-transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(50);
    res.json({ transactions });
  } catch (err) {
    console.error('Error fetching user transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add manual transaction
router.post('/api/user-transactions', authenticateToken, async (req, res) => {
  try {
    const { name, amount, date, category, accountId } = req.body;
    
    const transactionData = {
      userId: req.user._id,
      plaidTransactionId: `manual_${Date.now()}_${Math.random()}`,
      name,
      amount: parseFloat(amount),
      date: new Date(date),
      category: [category],
      pending: false
    };
    
    if (accountId) {
      transactionData.accountId = accountId;
    }
    
    const transaction = new Transaction(transactionData);
    
    await transaction.save();
    res.json({ transaction });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction
router.put('/api/user-transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { name, amount, date, category } = req.body;
    
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        name,
        amount: parseFloat(amount),
        date: new Date(date),
        category: [category]
      },
      { new: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ transaction });
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
router.delete('/api/user-transactions/:id', authenticateToken, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export default router;