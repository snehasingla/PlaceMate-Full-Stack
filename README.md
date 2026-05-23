# 🎯 PlaceMate — Your All-in-One Placement Preparation Platform

> A full-stack MERN application designed to help students prepare for placements efficiently — with smart tools, AI assistance, mock interviews, and premium features powered by Razorpay.

🌐 **Live Demo:** [place-mate-full-stack.vercel.app](https://place-mate-full-stack.vercel.app)

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Author](#author)

---

## 🧠 About the Project

PlaceMate is a comprehensive placement preparation platform built for engineering students. It consolidates everything a student needs — DSA tracking, revision planning, AI-powered resume analysis, mock interviews, and daily planning — into one seamless experience.

With Razorpay payment integration for premium features and a Gemini AI-powered mock interview module, PlaceMate goes beyond a simple tracker to become a complete placement companion.

---

## ✨ Features

### 🔐 Authentication
- Secure **JWT-based stateless authentication**
- User **Signup / Login** with form validation
- Protected routes — dashboard accessible only after login
- Persistent sessions using localStorage tokens

---

### 📊 Dashboard
- Personalized welcome screen after login
- Overview of progress across all modules
- Quick navigation to all features

---

### 📚 Core Modules

| Module | Description |
|--------|-------------|
| **DSA Tracker** | Track DSA problems by topic, difficulty, and status |
| **Revision Planner** | Schedule and manage revision sessions |
| **Notes** | Create, edit, and organize placement notes |
| **Daily Planner** | Plan your day with tasks and goals |
| **Progress Dashboard** | Visual progress tracking across all modules |

---

### 🤖 AI-Powered Features

#### ATS Resume Analyzer *(Gemini AI)*
- Upload your resume and get instant ATS compatibility score
- Actionable suggestions to improve resume for specific job roles
- Identifies missing keywords and formatting issues

#### Mock Interview *(AI-Powered)*
- Simulated interview sessions powered by AI
- Topic-based question generation (DSA, HR, Core CS)
- Real-time feedback on answers
- Track interview performance over time

---

### 💳 Razorpay Payment Integration
- Premium plan unlock via **Razorpay payment gateway**
- Secure order creation on backend
- Payment verification with signature validation
- Access to advanced features post-payment

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — Component-based UI
- **React Router DOM** — Client-side routing
- **Axios** — API communication
- **CSS / Tailwind** — Styling

### Backend
- **Node.js + Express.js** — REST API server
- **MongoDB + Mongoose** — Database with multi-collection architecture
- **JWT** — Stateless authentication
- **Razorpay SDK** — Payment processing
- **Google Gemini API** — AI features (Resume Analyzer, Mock Interview)

### Deployment
- **Vercel** — Frontend hosting
- **Render** — Backend hosting

---

## 📁 Project Structure

```
PlaceMate-Full-Stack/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DSATracker.jsx
│   │   │   ├── RevisionPlanner.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── DailyPlanner.jsx
│   │   │   ├── ResumeAnalyzer.jsx
│   │   │   └── MockInterview.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                  # Express backend
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route handlers
│   │   ├── auth.js
│   │   ├── dsa.js
│   │   ├── notes.js
│   │   ├── planner.js
│   │   ├── payment.js       # Razorpay routes
│   │   └── interview.js     # Mock interview routes
│   ├── middleware/          # Auth middleware (JWT)
│   ├── controllers/         # Business logic
│   └── index.js
│
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account (for payment features)
- Google Gemini API key

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/snehasingla/PlaceMate-Full-Stack.git
cd PlaceMate-Full-Stack
```

**2. Install server dependencies**
```bash
cd server
npm install
```

**3. Install client dependencies**
```bash
cd ../client
npm install
```

**4. Set up environment variables** (see below)

**5. Run the development servers**

In `/server`:
```bash
npm run dev
```

In `/client`:
```bash
npm run dev
```

---

## 🔐 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---


## 👩‍💻 Author

**Sneha Singla**  
3rd Year Computer Science Student  
[![GitHub](https://img.shields.io/badge/GitHub-snehasingla-black?logo=github)](https://github.com/snehasingla)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?logo=linkedin)](https://www.linkedin.com/in/sneha-singla-b14527352/)

---

## ⭐ Support

If you found this project helpful, please consider giving it a **star** ⭐ on GitHub — it means a lot!

---

> Built with 💙 to make placement prep less stressful and more structured.
