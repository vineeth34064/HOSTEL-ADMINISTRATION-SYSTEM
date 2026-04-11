# Hostel Management System (HMS)

This repository contains the source code for a comprehensive Hostel Management System, featuring an automated student portal and an administrative dashboard.

## Table of Contents

- [Overview](#overview)
- [Project Contributors](#project-contributors)
- [Structure](#structure)
- [Module Navigation](#module-navigation)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Frontend Components](#frontend-components)
- [Getting Started](#getting-started)
- [Configuration](#configuration)

## Overview

This project provides a complete hostel management solution with a Node.js/Express backend API and a modern React/Vite frontend. The system handles authentication, student inquiries, administrative overrides, and various self-service modules.

## Project Contributors

We are proud to acknowledge the following contributors who built the core modules of this system:

1. **Vineet - Team Leader**
   - **Emergency Module**: Real-time alert system for student safety.
   - **Gate Pass**: Digital request and approval workflow for campus entry/exit.
   - **Mess Menu**: Weekly menu management and snack tracking.
   - **Anti-Ragging**: Confidential reporting system for student security.

2. **Aftab**
   - **Dashboard**: Centralized overview for both students and admins.
   - **Profile Section**: Comprehensive user identity and information management.
   - **Auth**: Secure Authentication (JWT) and Authorization system.
   - **Health Records**: Student health tracking and record management.

3. **Ayush**
   - **Chat Section**: Real-time direct messaging between users.
   - **Lost and Found**: Community-driven item reporting and claiming.
   - **Parcel**: Tracking and notification system for student packages.
   - **Complaints**: Structured feedback and issue resolution pipeline.

4. **Sreekanth**
   - **Sports Arena**: Facility booking and activity notifications.
   - **Room Allocation**: Automated and manual room management system.
   - **Fees Section**: Fee status tracking and payment verification.
   - **Leave Request**: Formal leave application and tracking system.

## Structure

- `backend/` – Node.js / Express API source.
- `frontend/` – React / Vite / Tailwind UI source.

## Module Navigation

- **Backend**
  - `backend/src/models` – Mongoose schemas for core data.
  - `backend/src/controllers` – Request handlers for API endpoints.
  - `backend/src/routes` – Express routers for each feature area.
- **Frontend**
  - `frontend/src/components/admin` – Admin management tools.
  - `frontend/src/components/student` – Student self-service views.
  - `frontend/src/components/auth` – Login and registration flows.
  - `frontend/src/components/common` – Shared layout (Sidebar, Chatbot, etc.).

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion
- **Security**: JWT Authentication, CORS, Hashed tokens

## API Reference

The backend API is accessible at `http://localhost:5000/api`. Most endpoints require a valid session cookie.

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive session
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/session` - Check current session status


### Student & Admin Core
- `GET /api/students/:id` - Get student profile and related data
- `GET /api/admin/dashboard` - Get admin dashboard statistics

### Gate Pass & Leave
- `POST /api/gatepasses` - Apply for a gate pass
- `POST /api/gatepasses/:id/decision` - Approve/Reject gate pass (Admin)
- `POST /api/leaves` - Apply for a leave
- `POST /api/leaves/:id/decision` - Approve/Reject leave (Admin)

### Complaints & Emergency
- `POST /api/complaints` - File a new complaint
- `POST /api/complaints/:id/decision` - Resolve complaint (Admin)
- `POST /api/emergencies` - Trigger an emergency alert
- `POST /api/emergencies/:id/acknowledge` - Acknowledge alert (Admin)

### Room & Parcel Management
- `GET /api/rooms` - List all rooms and occupancy
- `POST /api/rooms/allocate` - Allocate room to student (Admin)
- `POST /api/rooms/:roomId/unassign` - Unassign student (Admin)
- `POST /api/parcels` - Add new parcel (Admin)
- `GET /api/parcels/student/:studentId` - Get student's parcels
- `POST /api/parcels/:id/collect` - Mark parcel as collected

### Messaging & Notifications
- `POST /api/chat` - Send direct message
- `GET /api/chat/search` - Search users for chat
- `GET /api/chat/recent` - Get recent conversations
- `GET /api/chat/:userId` - Get message history
- `GET /api/notifications` - Get notification history
- `POST /api/notifications` - Broadcast new notification (Admin)
- `POST /api/notifications/read` - Mark notifications as read

### Other Modules
- `PUT /api/mess-menu` - Update mess menu (Admin)
- `POST /api/fees/:studentId/toggle` - Toggle fee status (Admin)
- `POST /api/lost-found` - Post lost/found item
- `POST /api/lost-found/:id/claim` - Claim an item
- `POST /api/antiragging` - Submit anti-ragging report
- `GET /api/antiragging` - Get reports (My/All)
- `PUT /api/antiragging/:id` - Update report status (Admin)
- `GET /api/health/my` - Get health records
- `POST /api/chatbot` - AI Assistant interaction

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance (local or Cloud Atlas)

### Installation

1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Configuration

Ensure environment variables are set in both `backend/.env` and `frontend/.env`. Refer to the `.env` samples provided in the repository.
