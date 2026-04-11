# Hostel Management System (HMS)

This repository contains the source code for a comprehensive Hostel Management System, featuring an automated student portal and an administrative dashboard.

## Table of Contents

- [Overview](#overview)
- [Project Contributors](#project-contributors)
- [Structure](#structure)
- [Module Navigation](#module-navigation)
- [Tech Stack](#tech-stack)
- [Frontend Components](#frontend-components)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Health Check](#health-check)

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

Ensure environment variables are set in both `backend/.env` and `frontend/.env` (refer to the `.env` examples provided in previous turns).

## Health Check

- `GET /api/health` – returns `{ "status": "ok" }` when the server is operational.
