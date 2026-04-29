# LawyerDex — MERN Stack Clone

A full-stack MERN (MongoDB, Express, React, Node.js) clone of [lawyerdex.com](https://lawyerdex.com/), built with Tailwind CSS, Zod validation, and centralized error handling.

---

## 📁 Project Structure

```
lawyerdex/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite SPA
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on **http://localhost:5000**

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**

The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically.

---

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |
| GET | `/api/lawyers` | Search/list lawyers |
| GET | `/api/lawyers/featured` | Get featured lawyers |
| GET | `/api/lawyers/categories` | Get all categories |
| GET | `/api/lawyers/:id` | Get single lawyer |
| GET | `/api/resources` | List legal articles |
| GET | `/api/resources/latest` | Get 6 latest articles |
| GET | `/api/resources/:slug` | Get single article |
| POST | `/api/contact` | Submit contact form |

---

## ⚙️ Tech Stack

### Backend
- **Express.js** — HTTP server and routing
- **Mongoose** — MongoDB ODM
- **Zod** — Schema validation (request body + query)
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT auth
- **helmet** — Security headers
- **express-rate-limit** — Rate limiting
- **morgan** — HTTP logging

### Frontend
- **React 18** — UI library
- **Vite** — Build tool
- **React Router v6** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Zod** — Frontend form schema validation
- **React Hook Form** — Form management
- **@hookform/resolvers** — Zod ↔ RHF bridge
- **TanStack Query** — Server state management
- **Zustand** — Global auth state (persisted)
- **Axios** — HTTP client with interceptors

---

## 🔒 Architecture Highlights

### Centralized Error Handling (Backend)
All errors flow through a single `errorMiddleware.js`:
- Zod validation errors → 422 with field-level messages
- Mongoose errors → normalized 400 responses
- JWT errors → 401 auto-handled
- Unknown errors → safe 500 (no stack leak in production)

### Centralized Error Handling (Frontend)
Axios interceptors in `apiClient.js` normalize all errors:
- Attaches `err.normalized` with a consistent shape
- Auto-logout on 401
- Network/timeout errors caught and surfaced

### Zod Validation
- **Backend**: `validate` and `validateQuery` middleware wrap route handlers
- **Frontend**: `zodResolver` integrates Zod schemas with React Hook Form
- Shared schema structure (same rules on both ends)
