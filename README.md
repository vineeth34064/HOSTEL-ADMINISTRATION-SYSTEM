# SE

This repository contains the source code for a hostel management application.

## Table of Contents

- [Overview](#overview)
- [Structure](#structure)
- [Module Navigation](#module-navigation)
- [Backend (server/)](#backend-server)
- [Tech Stack](#tech-stack)
- [Frontend Components](#frontend-components)
- [Getting Started (Backend)](#getting-started-backend)
- [Configuration](#configuration)
- [API Health Check](#health-check)

## Overview

This project provides a hostel management backend API built with Node.js and Express, along with reusable frontend components for admin and student portals.

## Structure

- `server/` – backend API source under `server/src/`.
- `components/` – reusable frontend UI components grouped by role and feature.

## Module Navigation

- **Backend**
  - [`server/src/config`](#serversrcconfig) – database and app configuration.
  - [`server/src/models`](#serversrcmodels) – Mongoose schemas for core backend data.
  - [`server/src/controllers`](#serversrccontrollers) – request handlers for API endpoints.
  - [`server/src/routes`](#serversrcroutes) – Express routers for each API group.
  - [`server/src/middleware`](#serversrcmiddleware) – cross-cutting middleware (for example, auth or error handling).
- **Frontend components**
  - [`components/admin`](#componentsadmin) – admin dashboards and management views.
  - [`components/student`](#componentsstudent) – student dashboards and self-service views.
  - [`components/auth`](#componentsauth) – login/registration flows.
  - [`components/common`](#componentscommon) – shared layout elements.
  - [`components/ui`](#componentsui) – low-level UI primitives (buttons, inputs, cards, modals, etc.).

## Backend (server/)

The `server` folder contains a Node.js / Express REST API for hostel management tasks such as authentication, student and admin operations, leave and gate pass handling, complaints, emergencies, room allocation, parcels, mess menu, fees, lost-and-found, and notifications.

### server/src/config

- Connection logic for MongoDB and other configuration helpers.
- Central place to adjust database URIs and high-level app settings.

### server/src/models

- Mongoose schemas that represent the backend domain data used by the hostel management system.
- Used across controllers to read and write data in MongoDB.

### server/src/controllers

- Express handlers that implement the business logic for each feature area.
- Coordinate between models, validation, and responses to the client.

### server/src/routes

- Route definitions for the main API groups, mounted in `src/index.js`:
  - `authRoutes.js`
  - `studentRoutes.js`
  - `adminRoutes.js`
  - `leaveRoutes.js`
  - `gatePassRoutes.js`
  - `complaintRoutes.js`
  - `emergencyRoutes.js`
  - `roomRoutes.js`
  - `parcelRoutes.js`
  - `messMenuRoutes.js`
  - `feesRoutes.js`
  - `lostFoundRoutes.js`
  - `notificationRoutes.js`
- Each file defines an Express router focused on a specific feature area.

### server/src/middleware

- Common middleware used by routes (for example, authentication or error handling, if implemented).
- Applied to routes to enforce cross-cutting concerns.

## Tech Stack

- **Runtime**: Node.js (ES modules)
- **Framework**: Express
- **Database**: MongoDB with Mongoose ODM
- **Middleware**: CORS, cookie-parser, JSON body parsing

## Key Entry Points

- `server/src/index.js` – Express app entry point
  - Configures CORS, cookies, and JSON parsing
  - Health check endpoint at `GET /api/health`
  - Mounts feature routes under `/api/*`

## Main API Route Groups

- `/api/auth` – Authentication and session handling
- `/api/students` – Student-related operations
- `/api/admin` – Admin-related operations
- `/api/leaves` – Leave applications and approvals
- `/api/gatepasses` – Gate pass requests and tracking
- `/api/complaints` – Complaint registration and status
- `/api/emergencies` – Emergency reports
- `/api/rooms` – Room allocation and details
- `/api/parcels` – Parcel tracking
- `/api/mess-menu` – Mess menu management
- `/api/fees` – Fees and payments-related endpoints
- `/api/lost-found` – Lost-and-found items
- `/api/notifications` – Notifications to users

## Frontend Components

- `components/` – UI components (TypeScript/TSX) intended to be consumed by a frontend app (for example, a React/Vite single-page application).

### components/admin

Admin-facing pages and management tools, for example:

- `AdminDashboard.tsx` – overview of key hostel metrics and shortcuts.
- `AdminPortal.tsx` – main shell for admin navigation.
- `GatePassManagement.tsx`, `LeaveManagement.tsx`, `ComplaintManagement.tsx`, `EmergencyManagement.tsx` – manage gate passes, leaves, complaints, and emergencies raised by students.
- `RoomAllocation.tsx`, `ParcelManagement.tsx`, `MessMenuEditor.tsx`, `FeeStatus.tsx`, `LostAndFoundManagement.tsx` – allocation, parcels, mess menu, fees, and lost-and-found management views.

### components/student

Student-facing self-service views, for example:

- `StudentDashboard.tsx`, `StudentPortal.tsx`, `StudentProfile.tsx` – core student experience and profile management.
- `GatePassView.tsx`, `LeaveRequestView.tsx` – apply for and track gate passes and leaves.
- `ComplaintView.tsx`, `EmergencyView.tsx` – raise complaints and emergencies.
- `MessMenuView.tsx`, `ParcelView.tsx`, `FeePaymentView.tsx`, `LostAndFoundView.tsx`, `PrintableGatePass.tsx` – browse mess menu, track parcels, handle fees, see lost-and-found, and print gate passes.

### components/auth

Authentication UI:

- `LoginForm.tsx` – sign-in form.
- `RegisterForm.tsx` – registration form.

### components/common

Shared structural/layout components:

- `Sidebar.tsx` – navigation sidebar used across admin and student portals.

### components/ui

Low-level UI building blocks:

- `Button.tsx`, `Input.tsx`, `Textarea.tsx` – basic form controls.
- `Card.tsx` – content container.
- `Modal.tsx` – dialog/pop-up wrapper.

> Note: This repository focuses on the backend and shared components. The concrete frontend application (routing, pages, bundler configuration, etc.) may live in a separate repo or folder.

## Getting Started (Backend)

### Prerequisites

- Node.js and npm installed
- Access to a MongoDB instance

### Install dependencies

From the project root:

```bash
cd server
npm install
```

### Run in development

```bash
cd server
npm run dev
```

The server will start on port `4000` by default (or the value of `PORT` in your environment) and expose the API under `/api`.

### Run in production

Ensure your build or deployment pipeline produces `dist/index.js`, then:

```bash
cd server
npm start
```

This uses the `start` script defined in `server/package.json` to run the built server from `dist/index.js`.

## Configuration

- Database connection and other environment-specific settings are configured in `server/src/config/db.js` and related modules.
- Ensure any required environment variables (such as your MongoDB connection URI and authentication secrets) are set before starting the server.

## Health Check

- `GET /api/health` – returns `{ "status": "ok" }` when the server is up and responding.
