# TaskFlow Pro 🚀 - Advanced Task Management System

![TMS Banner](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)
*Streamline your team's workflow with intelligent task management*

## ✨ Key Features

<div align="center">

| Feature | Description | Preview |
|---------|-------------|---------|
| <img src="https://img.icons8.com/external-flaticons-flat-flat-icons/64/000000/external-authentication-cyber-security-flaticons-flat-flat-icons.png" width="40"/> **Role-Based Access** | Dual-portal system with granular permissions for Admins & Employees | ![Auth](screenshots/admin-login.png) |
| <img src="https://img.icons8.com/color/48/000000/task-completed.png" width="40"/> **Smart Task Engine** | Drag-and-drop interface with AI-powered prioritization | ![Tasks](screenshots/task-board.png) |
| <img src="https://img.icons8.com/fluency/48/000000/clock.png" width="40"/> **Real-Time Sync** | Instant updates across all devices with conflict resolution | ![Sync](screenshots/realtime-updates.gif) |
| <img src="https://img.icons8.com/color/48/000000/analytics.png" width="40"/> **Advanced Analytics** | Customizable dashboards with predictive metrics | ![Analytics](screenshots/analytics.png) |

</div>

## 🛠 Tech Stack Breakdown

### Frontend Architecture
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-06B6D4?logo=tailwind-css)

- **Core**: React 18 with Concurrent Mode
- **Styling**: Tailwind CSS + CSS Modules
- **State**: Redux Toolkit with RTK Query
- **Animations**: Framer Motion & GSAP
- **Charts**: Chart.js with custom plugins
- **Testing**: Jest + React Testing Library

### Backend Services
![Node](https://img.shields.io/badge/Node-18.x-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)

- **API**: Express with RESTful endpoints
- **Database**: MongoDB Atlas (Cloud)
- **Auth**: JWT with refresh tokens
- **Realtime**: Socket.IO with rooms
- **Validation**: Zod schemas
- **Testing**: Supertest + Mocha

## 🚀 Getting Started

### Prerequisites
- Node.js ≥18.x
- MongoDB ≥6.0
- Git 2.40+

### Installation Guide

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/Abir-Maji/TMS.git
cd TMS

# Install dependencies
npm run setup

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
npm run dev
