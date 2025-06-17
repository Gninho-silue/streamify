# Streamify - Social Media Platform

A modern social media platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- 🔐 User Authentication
- 👥 Friend System
- 💬 Real-time Chat
- 🔔 Notifications
- 👤 User Profiles
- 🎨 Theme Customization
- 🚫 User Blocking
- 🔍 User Search

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Query
- Stream Chat
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Gninho-silue/streamify.git
cd streamify
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Environment Setup
Create `.env` files in both backend and frontend directories:

Backend (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

Frontend (.env):
```
VITE_API_URL=http://localhost:5000
VITE_STREAM_API_KEY=your_stream_api_key
```

4. Run the application
```bash
# Run backend (from backend directory)
npm run dev

# Run frontend (from frontend directory)
npm run dev
```

## Project Structure

```
streamify/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Stream Chat](https://getstream.io/chat/) for real-time chat functionality
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Query](https://tanstack.com/query/latest) for data fetching 