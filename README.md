# Task Management System (TMS) 🚀

![TMS Banner](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)

A full-stack MERN application for efficient task management and team collaboration with role-based access control and real-time analytics.

## ✨ Key Features

### 1. Role-Based Dashboard
![Admin Dashboard](Screenshot%20(86).png)
- Personalized welcome with user recognition
- Visual priority overview with task status breakdown
- Real-time last updated timestamp
- Team-specific task analytics

### 2. Comprehensive Task Analytics
![Task Dashboard](Screenshot%20(85).png)
- Progress tracking with completion percentages
- Priority distribution charts
- Team performance metrics
- Deadline tracking system
- Interactive task filtering

### 3. Secure Authentication
![Admin Login](Screenshot%20(83).png)
- Role-based access control (Admin/Employee)
- Encrypted credential storage
- Persistent session management
- Responsive login interface

### 4. Developer Profile Section
![Developer Profile](Screenshot%20(82).png)
- Professional contact information
- CV download functionality
- Social media integration
- Project attribution

### 5. Modern Landing Page
![Landing Page](Screenshot%20(81).png)
- Animated UI with Framer Motion
- Feature highlights with icons
- Responsive design for all devices
- Clear call-to-action buttons

## 🛠 Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS
- Redux Toolkit
- Framer Motion (Animations)
- Chart.js (Analytics)

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT Authentication
- Socket.IO (Real-time)

## 🚀 Installation

```bash
# Clone repository
git clone https://github.com/Abir-Maji/TMS.git
cd TMS

# Backend setup
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
npm run dev
