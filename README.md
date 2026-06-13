# SmartLink URL Shortener

![SmartLink Logo](https://via.placeholder.com/1200x300?text=SmartLink+URL+Shortener) <!-- Placeholder for Logo/Banner -->

SmartLink is a modern, high-performance URL shortener application that allows users to create, manage, and analyze short links. It provides advanced features such as custom aliases, expiry dates, real-time analytics, bulk link generation, and QR code integration.

---

## 1. Project Overview

**SmartLink** simplifies the process of tracking marketing campaigns, sharing resources, and monitoring click engagement. With a dynamic dashboard and comprehensive analytics, users get complete visibility into how their audience interacts with their content.

### Screenshots

*(Placeholders for screenshots)*
- **Dashboard:** `![Dashboard Screenshot](link)`
- **Analytics:** `![Analytics Screenshot](link)`
- **QR Code & Details:** `![QR Code Screenshot](link)`

---

## 2. Architecture Overview

SmartLink is built with a decoupled client-server architecture:

- **Frontend (Client):** A Single Page Application (SPA) built with React and Vite. It consumes the REST API and provides interactive data visualization and link management. It includes a robust routing system, protected layouts, and top-level error boundaries.
- **Backend (Server):** A Node.js/Express API handling business logic, authentication, request validation, and CSV stream processing.
- **Database:** MongoDB acts as the primary data store. 
  - **Collections:** 
    - `users`: Stores encrypted credentials and user metadata.
    - `urls`: Stores the mapping of short codes/custom aliases to original URLs.
    - `clicks`: Stores high-resolution telemetry data for each click (IP, browser, device, OS, location).

---

## 3. Technology Stack

### Frontend
- **React 18** (UI Library)
- **Vite** (Build Tool)
- **React Router v6** (Client-side routing)
- **Recharts** (Interactive data visualization)
- **Vanilla CSS** (Custom styling framework)

### Backend
- **Node.js** (Runtime environment)
- **Express.js** (Web framework)
- **MongoDB** (NoSQL Database)
- **Mongoose** (Object Data Modeling)
- **JWT (JSON Web Tokens)** (Stateless Authentication)
- **Multer / CSV-Parser** (File upload and bulk processing)

---

## 4. Features

- **Authentication:** Secure user registration, login, and protected routes using JWT.
- **URL Shortening:** Generate randomized 6-character short codes for any long URL.
- **Custom Aliases:** Claim personalized links (e.g., `smartlink.to/my-brand`).
- **Expiry Dates:** Automatically expire links after a specific time to manage limited-time campaigns.
- **Analytics:** Track total clicks, referrers, browsers, devices, and geographic data with visual charts.
- **QR Codes:** Automatically generate a downloadable QR code for every shortened URL.
- **Bulk Upload:** Upload a CSV file to shorten up to hundreds of links simultaneously.
- **Profile Dashboard:** An overview of active/expired links and total click counts per user.

---

## 5. Installation Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)

### Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see Environment Variables below).
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the client directory if necessary (e.g. for defining the API base URL).
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 6. Environment Variables

### Backend (`server/.env`)
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/smartlink

# Authentication
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d
```

### Frontend (`client/.env`)
*(Optional: If Vite is configured to use environment variables for API endpoints)*
```env
VITE_API_URL=http://localhost:5001/api/v1
```

---

## 7. API Documentation

| Method | Endpoint | Purpose | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/auth/register` | Register a new user | Public |
| **POST** | `/api/v1/auth/login` | Authenticate user & get token | Public |
| **GET**  | `/api/v1/auth/me` | Get current logged-in user details | Private |
| **POST** | `/api/v1/url` | Create a new short URL | Private |
| **GET**  | `/api/v1/url` | Get all URLs for logged-in user | Private |
| **PUT**  | `/api/v1/url/:id` | Update an existing URL | Private |
| **DELETE**| `/api/v1/url/:id` | Delete a URL | Private |
| **POST** | `/api/v1/url/bulk` | Upload CSV for bulk generation | Private |
| **GET**  | `/api/v1/analytics/:shortCode` | Get private detailed analytics | Private |
| **GET**  | `/api/v1/public/:shortCode` | Get limited public analytics | Public |
| **GET**  | `/:shortCode` | Redirect to the original URL | Public |

---

## 8. Project Structure

```text
SmartLink/
├── client/                     # React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, UIStates, ErrorBoundary)
│   │   ├── hooks/              # Custom React hooks (useAuth)
│   │   ├── pages/              # Route page components (Home, Dashboard, Analytics, Profile)
│   │   ├── services/           # Axios API configuration
│   │   └── App.jsx             # Main Application routing
│   └── package.json
└── server/                     # Express Backend
    ├── config/                 # Database configurations
    ├── controllers/            # Route logic (auth, url, analytics)
    ├── middleware/             # Custom Express middlewares (auth, errorHandler)
    ├── models/                 # Mongoose schemas (User, URL, Click)
    ├── routes/                 # Express route definitions
    ├── index.js                # Entry point
    └── package.json
```

---

## 9. Usage Guide

1. **Register/Login:** Navigate to `/register` to create an account, or `/login` if you already have one.
2. **Create URL:** On the dashboard, enter your original URL. Optionally, add a custom alias (e.g., `promo2026`) and an expiry date. Click "Shorten URL".
3. **View Analytics:** Click the "Analytics" button on any generated link in your dashboard to view clicks over time, geographic data, and device types.
4. **Generate QR:** The QR code is automatically generated for your shortened URL and displayed in the dashboard table for immediate scanning or saving.
5. **Bulk Upload:** Use the "Bulk Create" utility on the dashboard to upload a `.csv` file with headers (`originalUrl`, `customAlias`, `title`). The system will process and return the short links in bulk.

---

## 10. Future Improvements

- **Export Analytics Data:** Allow users to download their analytics as CSV/PDF.
- **Password Reset Flow:** Add secure token-based email recovery.
- **Custom Domains:** Support for branding URLs with custom subdomains (e.g., `link.yourcompany.com`).
- **Webhooks:** Push notifications for click events to external services.
- **A/B Testing:** Allow a single short link to split traffic between multiple target URLs.

---

## 11. License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
