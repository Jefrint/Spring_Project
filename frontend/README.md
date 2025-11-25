# SpringProject Frontend

This is a Vite + React + TypeScript frontend for the Spring Boot backend.

## Quick Start

1. Install dependencies
```powershell
cd frontend
npm install
```

2. Run the dev server
```powershell
npm run dev
```

3. The dev server runs on http://localhost:3000 and proxies `/api` requests to `http://localhost:8080` (see `vite.config.ts`). Make sure your backend is running at port 8080.

## Features
- Items listing and details
- Cart management (add/remove/update/checkout)
- Orders listing for a user
- Authentication with JWT (Login/Register)

## Notes
- This is a minimal integration; adjust request/response payload fields to match your backend models if necessary.
- CORS: The dev server proxies API calls so you shouldn't need to configure CORS for development, but if running the frontend separately ensure backend CORS is enabled for `http://localhost:3000`.
