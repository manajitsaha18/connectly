# Connectly

### Real-Time Language Exchange Platform

Connectly is a full-stack language exchange platform that helps users discover language partners, build connections, and communicate through real-time chat and video calls.

## Live Demo

https://connectly-yf87.onrender.com/

## Features

- User registration and login
- JWT-based authentication
- HTTP-only cookie authentication
- User onboarding and profile management
- Language-based user profiles
- Discover language exchange partners
- Send and accept friend requests
- Friends management
- Real-time chat
- Video calling
- Notifications
- Random profile avatar generation
- Responsive user interface
- Protected routes and authorization

## Tech Stack

### Frontend

- React
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- DaisyUI
- Lucide React
- Stream Chat React SDK
- Stream Video React SDK

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cookie Parser
- CORS

### Real-Time Communication

- Stream Chat
- Stream Video

### Deployment

- Render

## Project Structure

```text
Connectly/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── constants/
│   └── package.json
│
├── package.json
├── .gitignore
└── README.md
