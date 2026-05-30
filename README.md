# 🍽️ DineEase
A production-ready restaurant reservation platform with secure Google login, Stripe payments, and modular backend services.

## Overview
DineEase is a full-stack restaurant booking application built with React, Express, MongoDB, and Stripe. It supports authenticated table reservations, server-side payment processing, and confirmation email delivery.

This README highlights the project architecture, backend service modules, and recent enhancements so that reviewers on LinkedIn can quickly understand the design and capabilities.

## What makes this project production-level?
- ✅ Modular backend service design: authentication, reservation, payment, and email layers are separated into dedicated controllers, routes, and middleware.
- ✅ Google OAuth login with JWT-based protection for API access.
- ✅ Server-side Stripe payment intent creation and payment verification to avoid trusting client price data.
- ✅ Authenticated reservation creation tied to user identity.
- ✅ Email confirmation service for booking receipts.
- ✅ Strong frontend UX with state persistence, notifications, and responsive form handling.
- ✅ Centralized error handling and CORS configuration.

## Backend Service Architecture
The backend is organized into logical service modules that behave like microservices internally:

### 1. Authentication Service (`auth`)
- Endpoint: `POST /api/v1/auth/google`
- Validates Google ID tokens using `google-auth-library`
- Creates or upserts users in MongoDB
- Issues JWT tokens with a 7-day expiry
- Stores user session details safely in local storage on the frontend

### 2. Reservation Service (`reservation`)
- Endpoint: `POST /api/v1/reservation/send`
- Requires authentication middleware (`isAuthenticated`)
- Validates reservation fields and enforces required booking data
- Calculates trusted table pricing server-side
- Saves reservations with `paymentStatus: pending`
- Returns `reservationId` for the payment flow

### 3. Payment Service (`payments`)
- Endpoint: `POST /api/v1/payments/create-payment-intent`
- Endpoint: `POST /api/v1/payments/confirm`
- Creates Stripe Payment Intents using trusted server-side reservation pricing
- Verifies payment status by fetching the Stripe intent before marking booking as paid
- Persists payment records and updates reservation status to `paid`

### 4. Email Notification Service (`emailService`)
- Uses `resend` for transactional email delivery
- Sends an elegant booking confirmation email after successful payment
- Operates asynchronously so the API response is not blocked by email delivery
- Includes receipt details: guest name, date, time, table, total paid, and payment reference

## Recent Frontend Enhancements
- Auto-fills the reservation email field from the authenticated user profile
- Ensures fields like email, date, and time render correctly in dark mode
- Uses Google login button for authentication in the reservation flow
- Protects booking and payment actions behind valid JWT tokens
- Provides toast notifications for errors, success, and flow feedback
- Offers responsive reservation UI with table selection and price preview

## User Workflow
1. User logs in with Google
2. User selects table type, date, time, and enters booking details
3. Backend creates a reservation and returns a reservation ID
4. Frontend requests a Stripe Payment Intent based on reservation price
5. User completes payment through Stripe Elements
6. Backend verifies payment status, saves payment record, and marks reservation as paid
7. Booking confirmation email is triggered automatically

## Key Technologies
- Frontend: React, React Router, Axios, React Hot Toast, Stripe Elements
- Backend: Node.js, Express, MongoDB, Mongoose, Stripe, JSON Web Tokens
- Authentication: Google OAuth, JWT
- Email: Resend transactional email service
- Deployment-ready practices: environment-based configuration, CORS, centralized error handling

## Project Structure
```
DineEase/
├── backend/                  # Express API, controllers, models, routes, middleware
│   ├── controller/           # Business logic and service handlers
│   ├── middlewares/          # Auth and error handling
│   ├── models/               # MongoDB schema definitions
│   ├── routes/               # API route definitions
│   ├── services/             # Email and utility services
│   └── server.js             # Entry point
└── frontend/                 # React UI and Stripe frontend flow
```

## Environment Variables
Create a `.env` file for the backend with values such as:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `STRIPE_SECRET_KEY`
- `FRONTEND_URL`
- `RESEND_API_KEY`

Frontend should have an `.env` like:
- `VITE_API_URL`

## Installation
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Notes for Reviewers
This project is built with a production mindset:
- Backend service modules are separated and reusable
- Authentication is secure and token-based
- Payment flow avoids client-side price tampering
- Email notifications are decoupled from the main response cycle
- UX improvements are made with real form handling and validation

If you are reviewing this on LinkedIn, the key strengths are:
- Microservice-style backend separation
- Secure third-party integrations with Google and Stripe
- Real-world reservation and payment lifecycle
- Clear, modular code structure ready for scaling

---

If you'd like, I can also add a short “Project Highlights” section especially for LinkedIn posts.  