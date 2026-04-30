# Smart Student Management System (SmartSMS)

A modern, full-stack MERN application for managing student records with a clean, professional UI featuring glassmorphism design, smooth animations, and subtle 3D elements.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS v4, Framer Motion, Recharts, React Three Fiber |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |

## ✨ Features

- **JWT Authentication** with role-based access (Admin & Student)
- **Full CRUD** for student records with search, filter, and pagination
- **Admin Activity Logs** to track creations, updates, deletions, and exports
- **CSV Export** for student data (Admin only)
- **User Profiles** with basic detail updates
- **Dashboard** with analytics charts (bar + pie) and recent entries
- **3D Elements** — subtle floating wireframe on login & dashboard header
- **Skeletons & Empty States** for seamless loading and no-data experiences
- **Glassmorphism UI** with smooth Framer Motion animations
- **Fully responsive** (mobile + desktop)

## 📁 Project Structure

```
nsf-apply/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   └── utils/          # API utility
│   └── ...
├── server/                 # Node.js backend
│   ├── config/             # Database config
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   └── server.js           # Entry point
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repo-url>
cd nsf-apply
```

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Students
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/students` | List students (with search/filter/pagination) | Private |
| GET | `/api/students/:id` | Get single student | Private |
| POST | `/api/students` | Create student | Admin |
| PUT | `/api/students/:id` | Update student | Admin |
| DELETE | `/api/students/:id` | Delete student | Admin |
| GET | `/api/students/stats/dashboard` | Dashboard statistics | Private |

### Query Parameters for GET /api/students
- `search` — Search by name, roll number, or email
- `department` — Filter by department
- `year` — Filter by year (1-4)
- `status` — Filter by status (active/inactive/graduated)
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10)
- `sortBy` — Sort field
- `order` — Sort order (asc/desc)

## 🗄️ Database Schema

### User
```js
{ name, email, password (hashed), role (admin/student) }
```

### Student
```js
{ name, rollNumber, department, email, phone, year, cgpa, status, address, createdBy }
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ to Vercel
```

### Backend (Render)
1. Set environment variables on Render
2. Set build command: `npm install`
3. Set start command: `node server.js`

## 📝 Default Test Credentials

Register a new admin account to get started:
1. Go to `/register`
2. Select "Admin" role
3. Create your account
4. Start adding students!

## License
MIT
