# Deployment Guide - Hostel Management System

This guide outlines how to deploy the Hostel Management System to various platforms.

## Prerequisites
- [Docker](https://www.docker.com/) (Recommended)
- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (For managed database)

---

## Method 1: Using Docker (easiest for self-hosting)

1. Clone the repository.
2. Create a `.env` file in the root (optional, or use existing `backend/.env`).
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Access the app at `http://localhost:5000`.

---

## Method 2: Manual Deployment (Render, Railway, DigitalOcean)

### 1. Database Setup
- Create a free cluster on **MongoDB Atlas**.
- Get your connection string (e.g., `mongodb+srv://<user>:<password>@cluster.mongodb.net/hostel_db`).

### 2. Frontend Configuration
- In `frontend/src/services/api.js` (or equivalent), ensure the `baseURL` points to your backend URL (or relative `/api` if served from the same domain).
- Run `npm run build` in the root to ensure the frontend builds correctly.

### 3. Backend Deployment
- Deploy the `backend` folder to your provider.
- **Environment Variables**:
  - `NODE_ENV=production`
  - `MONGODB_URI`= (Your Atlas URI)
  - `JWT_SECRET`= (A long random string)
  - `PORT`= 5000 (standard)

### 4. Consolidated Build
The system is now configured to serve the frontend from the backend. When you deploy the whole repository:
1. Run `npm run build` from the root.
2. Start the app with `npm start`.

---

## Method 3: Vercel (Frontend) + Render (Backend)

If you prefer separating them:
1. **Frontend**: Deploy the `frontend/` folder to Vercel.
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
2. **Backend**: Deploy the `backend/` folder to Render.
   - Configure environment variables.
   - Update `cors` in `backend/src/index.js` to allow your Vercel URL.

---

## Common Issues
- **CORS Error**: Ensure the `origin` in `backend/src/index.js` matches your frontend domain.
- **Port Conflict**: The backend defaults to 5000. Ensure your host allows this port.
- **Missing Env Vars**: Always double-check `JWT_SECRET` and `MONGODB_URI`.
