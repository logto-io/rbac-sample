# Logto RBAC Sample Application

This repository contains the sample code for the blog post [RBAC in Practice](https://blog.logto.io/rbac-in-practice). It demonstrates how to implement Role-Based Access Control (RBAC) using Logto in a full-stack application.

## Project Structure

The project consists of two main parts:
- `backend/`: A Node.js API server with RBAC implementation
- `frontend/`: A React application demonstrating role-based UI and access control

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
  Update the `.env` file with your Logto configuration values (issuer URL, JWKS URL, and API resource identifier from your Logto console).

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
  Update the `.env` file with your configuration values.

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (frontend) and the API at `http://localhost:3000` (backend).
