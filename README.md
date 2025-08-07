# Appointment Booking - Full-Stack Project

This is a full-stack appointment booking application for a small clinic, built within a 4-hour time limit. It features a secure backend API and a responsive frontend, allowing patients to book appointments and admins to view all bookings.

---

## 🚀 Live Demo & Credentials

| Item                | Link / Value                                                                    
| ------------------- | ------------------------------------------------------------------------------- 
| **Frontend URL**    | `https://appointment-booking-bice.vercel.app/`                                                
| **API URL**         | `https://appointment-booking-xufv.onrender.com`                                               
| **Patient Login**   | **Email:** `patient@example.com` <br/> **Password:** `Passw0rd!`                  
| **Admin Login**     | Given Credentials in the Docs                                                                                                            
| **Verification**    | All local run, deployment, and cURL verification steps have been included below. 

---

## ✨ Features

- **Patient Role**: Register, log in, view available appointment slots for the next 7 days, and book an available slot.
- **Admin Role**: Log in and view a list of all appointments booked by all patients.
- **Secure**: Implements role-based access control (RBAC), password hashing, and protection against double-booking.
- **User-Friendly UI**: A dark-themed, responsive interface with date/time selection, confirmation modals, and admin filtering.

---

## 🛠 Tech Stack & Choices

This project is a monorepo with a separate frontend and backend.

| Area      | Technology                               | Rationale & Trade-offs                                                                                                                                                                                                       |
| --------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**| **Next.js (App Router) & React**       | Chosen for its powerful server-side rendering capabilities, which lead to a fast initial page load, and its excellent developer experience. The App Router simplifies layouts and a component-based architecture is a natural fit. |
| **Styling** | **Tailwind CSS**                         | A utility-first CSS framework that enables rapid UI development without leaving the HTML. This was crucial for building a clean UI quickly within the time constraint.                                                    |
| **Backend** | **Node.js & Express.js**               | A lightweight and highly popular choice for building REST APIs. Its minimalist nature is perfect for this project's scope, and its vast ecosystem allows for easy integration of middleware for security and performance.         |
| **Database**| **MongoDB & Mongoose**                 | MongoDB's flexible, document-based nature works well with JavaScript and allows for rapid schema design. Mongoose provides robust data modeling, validation, and business logic hooks, which was key for a secure implementation. |
| **Deployment**| **Vercel (Frontend) & Render (Backend)** | This combination provides a seamless, Git-based deployment workflow with generous free tiers. Vercel is optimized for Next.js, and Render is a simple, effective platform for deploying Node.js servers and background services. |

---

## 📦 Running the Project Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Git](https://git-scm.com/)
- Access to a MongoDB Atlas cluster

### 1. Setup

```bash
# Clone the repository
git clone https://github.com/vatsaltibrewal/Appointment-Booking
cd Appointment-Booking

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables

You will need two `.env` files. Create them and fill them with your own credentials.

**Backend (`backend/.env`)**
```env
MONGO_URI="your_mongodb_atlas_connection_string"
JWT_SECRET="a_very_long_and_super_secret_string"
PORT=10000
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="Password!"
```

**Frontend (`frontend/.env.local`)**
```env
NEXT_PUBLIC_API_URL="http://localhost:10000"
```

### 3. Seed the Database

The backend uses a persistent slot model. Run the seeding script **once** to populate the database with available slots for the next 7 days.

```bash
# From the /backend directory
node seedSlots.js
```

### 4. Run the Services

Run the backend and frontend servers in two separate terminals.

```bash
# Terminal 1: Run the backend server (from /backend)
npm start
# Server will be running at http://localhost:10000

# Terminal 2: Run the frontend server (from /frontend)
npm run dev
# App will be running at http://localhost:3000
```

---

## 🏗️ Architecture & Design Decisions

### Folder Structure
The project is a monorepo with clear separation of concerns:
- `/frontend`: Contains the entire Next.js application, responsible for all UI and client-side logic.
- `/backend`: Contains the Express API, responsible for business logic, database interactions, and authentication.
The backend follows an MVC-like pattern (`models`, `routes`, `controllers`, `middleware`) for organization and scalability.

### Authentication & Authorization (Auth + RBAC)
- **JWT (JSON Web Tokens)** are used for authentication. On successful login, the server signs a token containing the user's ID and role (`patient` or `admin`), which is stored in the browser's `localStorage`.
- **RBAC Middleware**: Protected routes are guarded by middleware. A `protect` middleware verifies the JWT on incoming requests. An `admin` middleware is chained after `protect` on admin-only routes to ensure the user's role is 'admin'.

### Concurrency & Double-Booking Prevention
This is the most critical piece of business logic. Double-booking is prevented **at the database level** for atomic, race-condition-proof safety.
- A `unique` index is placed on the `slotId` field in the `bookings` collection.
- If two users attempt to book the exact same slot simultaneously, the first write operation to the database will succeed. The second will be rejected by MongoDB with a duplicate key error (code `11000`).
- The backend catches this specific error and returns a user-friendly `409 Conflict` response with the code `SLOT_TAKEN`.

### Error Handling Strategy
The API provides a consistent JSON error shape for predictable error handling on the frontend: `{ "error": { "code": "ERROR_CODE", "message": "A descriptive message." } }`. A global error handler in Express catches any unhandled errors, and specific controllers handle expected errors like validation or conflicts.

---

## ☁️ Deployment Steps

The application was deployed using a standard Git-ops workflow.

1.  **Database:** A free-tier cluster was created on **MongoDB Atlas**. The IP whitelist was configured to only allow access from the Render backend's static IP addresses for security.
2.  **Backend:** The `backend` folder was connected to a **Render** "Web Service." Environment variables (including the `MONGO_URI` and `JWT_SECRET`) were added via the Render dashboard. Render automatically runs `npm install` and `npm start` on push.
3.  **Frontend:** The `frontend` folder was connected to **Vercel**. The `NEXT_PUBLIC_API_URL` environment variable was set to the live Render URL. Vercel automatically detects the Next.js framework and builds/deploys on every push to the `main` branch.

---

##  verification-script Quick Verification Script (cURL)

These commands allow you to verify the core API functionality from your terminal.

```bash
# --- 1. Register a New Patient ---
curl -X POST -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john.doe@example.com","password":"Password123!"}' \
  https://appointment-booking-xufv.onrender.com/api/register

# --- 2. Login as the New Patient ---
# Note: You may need a tool like jq to parse the token automatically.
# Otherwise, copy the token from the response for the next step.
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"Password123!"}' \
  https://appointment-booking-xufv.onrender.com/api/login | jq -r .token)

echo "Auth Token: $TOKEN"

# --- 3. Get Available Slots (for the next day) ---
# Replace YYYY-MM-DD with tomorrow's date
curl -H "Authorization: Bearer $TOKEN" \
  https://appointment-booking-xufv.onrender.com/api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD

# --- 4. Book a Slot ---
# Copy a slot "id" from the previous command's output
SLOT_ID="[PASTE_A_VALID_SLOT_ID_HERE]"
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d "{\"slotId\":\"$SLOT_ID\"}" \
  https://appointment-booking-xufv.onrender.com/api/book

# --- 5. See Your Bookings ---
curl -H "Authorization: Bearer $TOKEN" \
  https://appointment-booking-xufv.onrender.com/api/my-bookings
```

---

## 🔮 Known Limitations & Future Improvements

Given more time, here are the areas I would focus on next:

- **Implement Unit & Integration Tests**: Add backend tests using Jest/Supertest to validate controllers and middleware. This is the highest priority for ensuring long-term reliability.
- **Add an Admin UI for Slot Management**: While the API supports creating/deleting slots, a dedicated UI for admins would complete this feature.
- **Patient-Facing Cancellations**: Allow patients to cancel their own bookings from the "My Bookings" page.
- **Email/SMS Notifications**: Integrate a service like SendGrid or Twilio to send booking confirmations and reminders.
- **More Sophisticated Rate Limiting**: Implement different rate limits for different API routes based on cost or sensitivity. (e.g., stricter limits on login).
