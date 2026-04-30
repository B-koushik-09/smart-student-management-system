# 🎓 SmartSMS: Smart Student Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

A high-performance, production-grade MERN stack application designed for modern educational institutions. Featuring a stunning **Glassmorphism UI**, interactive **3D elements**, and robust **Admin oversight** tools.

---

##  High-Impact Features

###  Secure Authentication
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins and Students.
- **JWT & Bcrypt**: Industry-standard security for session management and password hashing.
- **Protected Routes**: Granular frontend and backend route guards.

###  Advanced Analytics & Dashboard
- **Interactive Data Viz**: Real-time stats visualized through Recharts (Bar & Pie).
- **Recent Activity**: Instant overview of the latest student registrations.
- **Metric Cards**: High-level summaries for total students, CGPA averages, and more.

###  Comprehensive Student CRUD
- **Smart Search**: Debounced global search across Name, Roll Number, and Email.
- **Multi-Filter System**: Refine results by Department, Year, or Enrollment Status.
- **Pagination**: Optimized for large datasets to ensure smooth performance.

###  Professional Admin Tools
- **  Activity Logs**: Full audit trail for every record creation, update, deletion, and export.
- **  CSV Export**: One-click data export functionality for external reporting.
- **Dummy Data Seeding**: Pre-built script to populate the system for instant testing.

---

##  Design Aesthetic
- **Modern UI**: Clean, professional layout with curated HSL color palettes.
- **Glassmorphism**: Subtle blur effects and semi-transparent layers for a premium feel.
- **Micro-Animations**: Smooth transitions powered by Framer Motion.
- **3D Interactive Objects**: Elegant, slow-rotating icosahedron wireframes using React Three Fiber.
- **Skeletons**: Seamless loading experiences that eliminate layout shifts.

---

##  Project Structure

```bash
nsf-apply/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Atomic & Layout components
│   │   ├── context/        # Global Auth & State
│   │   ├── pages/          # View components
│   │   └── utils/          # API & Helper functions
│   └── public/             # Static assets
└── server/                 # Node.js/Express Backend
    ├── config/             # Database connection
    ├── controllers/        # Business logic
    ├── middleware/         # Auth & Validation
    ├── models/             # Mongoose Schemas
    ├── routes/             # API Endpoints
    └── utils/              # Logger & Utilities
```

---

##  Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or Local MongoDB
- npm or yarn

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/smartsms.git
cd nsf-apply
```

### 2. Backend Configuration
Navigate to the server directory, install dependencies, and set up your environment:
```bash
cd server
npm install
# Create .env and add:
# PORT=5000
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_secret_key
```

### 3. Database Seeding (Optional)
Instantly populate your database with 20 dummy records and an admin user:
```bash
npm run seed  # or: node scripts/seed.js
```

### 4. Run the Application
Open two terminals to start the full stack:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
```

---

##  API Reference

### User Authentication
| Endpoint | Method | Access |
| :--- | :--- | :--- |
| `/api/auth/register` | POST | Public |
| `/api/auth/login` | POST | Public |
| `/api/auth/profile` | PUT | Private |

### Student Management
| Endpoint | Method | Access |
| :--- | :--- | :--- |
| `/api/students` | GET | Private |
| `/api/students` | POST | Admin |
| `/api/students/:id` | PUT | Admin |
| `/api/students/:id` | DELETE | Admin |
| `/api/students/export/csv` | GET | Admin |
| `/api/logs` | GET | Admin |

---

##  Credentials for Testing
If you ran the seeding script, you can log in with:
- **Email**: `admin@smartsms.com`
- **Password**: `password123`
- **Role**: Admin

---

##  License
Distributed under the MIT License. See `LICENSE` for more information.

---

