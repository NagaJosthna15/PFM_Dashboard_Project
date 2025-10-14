# PFM Dashboard

Personal Finance Management Dashboard built with React and Node.js.

## Features

- User authentication (login/register)
- Profile management with photo upload
- Dashboard interface
- JWT-based authentication with HttpOnly cookies
- **Bank Account Integration**
  - Plaid Link integration for secure bank connections
  - Real-time account balances display
  - Transaction history viewing
  - Secure access token storage

## Tech Stack

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios
- React Hot Toast
- React Plaid Link

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Redis for token blacklisting
- JWT authentication
- Multer for file uploads
- bcrypt for password hashing
- Plaid API integration

## Setup

### Prerequisites
- Node.js (v16+)
- MongoDB
- Redis

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pfm-dashboard
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Create environment file
```bash
cd ../backend
cp .env.example .env
```

5. Update `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/pfm-dashboard
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Plaid Configuration (Week 2)
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET_KEY=your-plaid-secret-key
PLAID_ENV=sandbox
PLAID_API_VERSION=2020-09-14
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Week 2 - Bank Integration Setup

### Plaid Developer Account
1. Sign up at [Plaid Dashboard](https://dashboard.plaid.com/)
2. Get your API keys from the sandbox environment
3. Add keys to your `.env` file

### New Features
- **Connect Bank Accounts**: Click "Connect Bank Account" on dashboard
- **View Balances**: See real-time account balances
- **Transaction History**: View recent transactions (last 30 days)
- **Secure Storage**: Access tokens stored securely in MongoDB

### API Endpoints (Week 2)
- `POST /api/create_link_token` - Generate Plaid Link token
- `POST /api/exchange_public_token` - Exchange public token for access token
- `GET /api/accounts` - Fetch connected accounts and balances
- `GET /api/transactions` - Fetch recent transactions
- `POST /api/sandbox/create_public_token` - Generate test token (sandbox only)

## Project Structure

```
pfm-dashboard/
├── backend/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   │   └── PlaidItem.js          # Plaid token storage
│   ├── routes/
│   │   └── plaidRoutes.js        # Plaid API endpoints
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlaidLink.jsx     # Bank connection component
│   │   │   ├── AccountsList.jsx  # Display accounts
│   │   │   └── TransactionsList.jsx # Display transactions
│   │   ├── context/
│   │   ├── pages/
│   │   │   └── Dashboard.jsx     # Updated with Plaid integration
│   │   └── utils/
│   │       └── api.js            # Axios configuration
│   └── public/
└── README.md
```