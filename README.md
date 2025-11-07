# 🏦 Credify - Full-Stack Banking Application

## 📖 Project Overview
**Credify** is a secure, full-stack banking application designed to manage banking operations efficiently.  
It is built using **React** for the frontend and **Node.js with Express** for the backend, connected to **MongoDB**.  
The app allows users to perform transactions, view their transaction history, and employees to approve, verify, and manage payments, including integration with the **SWIFT payment system**.

---

## 🗂 Project Structure

### 1. Frontend (`client/`)
- **Framework:** React + Vite  
- **Purpose:** Provides the user interface for both customers and employees.
- **Key Components:**
  - `index.html` – Main HTML entry point.
  - `src/` – React components and pages (Dashboard, SWIFT page, Login, etc.).
  - `vite.config.js` – Vite configuration for development and build.
  - `hashPassword.js` – Utility to securely hash passwords with bcrypt.

---

### 2. Backend (`server/`)
- **Framework:** Node.js + Express  
- **Purpose:** Handles API requests, user authentication, transaction management, and database interactions.
- **Key Components:**
  - `server.js` – Express server setup, MongoDB connection, and API routing.
  - `routes/` – Defines endpoints for authentication and transactions.
  - `models/` – Mongoose models for Users and Transactions.
  - `package.json` – Backend dependencies including `express`, `mongoose`, `bcryptjs`, and `dotenv`.

---

### 3. Security & Authentication
- **Password Security:** Passwords are hashed and salted using bcrypt.
- **JWT Authentication:** JSON Web Tokens are used to secure API requests.
- **Static Employee Accounts:** Employees are preconfigured; registration is not allowed.
- **Input Validation:** All user inputs are whitelisted using regex to prevent injections.
- **SSL:** All traffic must be served over HTTPS in production.

---

### 4. DevSecOps Pipeline
**CircleCI** is used to automate builds, testing, and code quality checks.

- **Linting:** ESLint is configured for both frontend and backend.  
- **Testing:** Unit and integration tests run automatically on push or pull requests.  
- **Code Quality:** SonarQube scans for bugs, vulnerabilities, and code smells.  
- **Vulnerability Checks:** `npm audit` is run in CI to check dependencies.  
- **Future Deployment:** Configured for deployment on free platforms like **Vercel** (frontend) or **Render** (backend).  

---

### 5. SWIFT Payment System Integration

**Purpose:** Allows employees to verify, approve, and submit international payments securely.

**Features:**
- Users can create new transactions with **amount, currency, SWIFT code, and account info**.
- Employees can view **pending transactions**, update statuses (`verified`, `approved`, `rejected`), and submit approved payments.
- Statuses are visually highlighted and tracked.
- Transactions are safely handled via API calls.

---

### 6. Features

**Customer Portal:**
- Login securely with JWT and password hashing.
- View transaction history.
- Make new SWIFT payments.

**Employee Portal:**
- View all user transactions.
- Approve, verify, or reject transactions.
- Submit approved transactions to SWIFT.
- Dashboard with status highlights for quick monitoring.

**Shared Features:**
- Responsive and user-friendly UI.
- Consistent styling and clean design.
- Security best practices applied across the stack.

---

### 7. Improvements from Part 2

- Added **full SWIFT transaction management** for employees.
- **Improved UI** consistency across dashboards.
- **Frontend and backend fully integrated** with JWT and authentication.
- Added **input validation** on all forms for security.
- Implemented **linting and CI/CD pipeline** for DevSecOps compliance.
- Passwords are now securely hashed and salted.
- Static employee accounts added; registration removed for employees.
- Implemented better error handling on API requests.

---

### 8. Installation & Running Locally

#### Backend

```bash
cd server
npm install
npm run dev
```

- Requires `.env` with `MONGODB_URI` and `JWT_SECRET`.

#### Frontend

```bash
cd client
npm install
npm run dev
```

- Frontend runs on **http://localhost:5000** by default.

---

### 9. Usage

1. Login as a preconfigured user or employee.
2. Users can create SWIFT transactions.
3. Employees can manage transactions, approve, and submit them.

---

### 10. Future Enhancements

- Deploy frontend on **Vercel** and backend on **Render**.
- Implement **MFA (Multi-Factor Authentication)** for added security.
- Add **refresh tokens** for longer session security.
- Integrate **email notifications** for transaction status changes.

---

### 11. Contributors

- **Saihil Gurupersad**
- **Yash Dhurumraj (ST10266783)**
- **Dinay Ramchander (ST10311999)**
- **Nehara Pillay (ST10198206)**
- **Varun Perumal (ST10110356)**

---

## 📋 Changelog

### Part 3 Improvements
- ✅ Complete SWIFT payment integration for employee portal
- ✅ Enhanced security with JWT and bcrypt password hashing
- ✅ CI/CD pipeline with GitHub Actions
- ✅ Comprehensive input validation and sanitization
- ✅ Improved error handling across all API endpoints
- ✅ Static employee accounts with role-based access control
- ✅ Responsive UI with consistent design language
- ✅ Automated testing with Jest and code coverage reporting

### Part 2 Features
- Basic transaction management
- User authentication
- MongoDB integration
- Initial frontend design

---

## Video Demonstration

<a href="https://youtu.be/pfjKzDTsiWs?si=lcgsingckR2zW6RM" target="_blank">
  <img src="https://img.shields.io/badge/Watch%20Demo%20Video-FF0000?style=for-the-badge&logo=youtube&logoColor=white&labelColor=FF0000" alt="Watch Demo Video" />
</a>
