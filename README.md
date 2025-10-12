# PFM Dashboard

Personal Finance Management Dashboard built with React and Node.js.

## Features

- User authentication (login/register)
- Profile management with photo upload
- Dashboard interface
- JWT-based authentication with HttpOnly cookies

## Tech Stack

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Redis for token blacklisting
- JWT authentication
- Multer for file uploads
- bcrypt for password hashing

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

## Project Structure

```
pfm-dashboard/
├── backend/
│   ├── config/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── public/
└── README.md
```