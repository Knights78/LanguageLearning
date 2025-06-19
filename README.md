# LanguageLearning

## 🧠 Backend - MERN Stack

This backend is built using **Node.js**, **Express.js**, and **MongoDB**. It provides APIs for authentication, user management, and other project-specific functionalities.

---

### 📁 Folder Structure

backend/
├── config/ # DB and environment config
├── controllers/ # Request logic (e.g. userController.js)
├── middleware/ # Custom middleware (e.g. authMiddleware.js)
├── models/ # Mongoose models (e.g. User.js)
├── routes/ # API route files
├── utils/ # Helper functions (if any)
└── server.js # Entry point for Express app

---

### 🚀 Setup Instructions

1. **Navigate to the backend directory**:
   ```bash
   cd backend
npm install
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Start the backend server:

bash
Copy
Edit
npm run dev
The server will start on http://localhost:5000
 Notes
Ensure MongoDB is running or MongoDB Atlas is properly configured.

Make sure frontend (React) communicates with this backend via the correct port.

This backend is part of a full MERN stack application.