# 💰 My Finance Track

<p align="center">
  <strong>Track Your Money. Free Your Mind.</strong><br>
  An intelligent, full-stack personal finance and wealth management platform with AI-driven insights, predictive analytics, goal tracking, and automated reporting.
</p>

<p align="center">
  <a href="https://my-finance-tracker-omega-ten-32.vercel.app/"><img src="https://img.shields.io/badge/Live%20Demo-Vercel-35E9A0?style=for-the-badge&logo=vercel&logoColor=black" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/API%20Server-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="API Server" /></a>
  <a href="https://github.com/iamaby-0/finance-tracker"><img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Groq_AI-F55036?style=flat-square&logo=openai&logoColor=white" alt="Groq AI" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=flat-square" alt="License" />
</p>

---

<p align="center">
  <img src="screenshots/01-dashboard.png" alt="My Finance Track Dashboard" width="100%" />
</p>

---

## 🌟 Live Links

- 🌐 **Web Application:** [https://my-finance-tracker-omega-ten-32.vercel.app/](https://my-finance-tracker-omega-ten-32.vercel.app/)
- 📦 **Source Code:** [https://github.com/iamaby-0/finance-tracker](https://github.com/iamaby-0/finance-tracker)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Application Previews & Screenshots](#-application-previews--screenshots)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [System Architecture Diagram](#-system-architecture-diagram)
- [Directory Structure](#-directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Overview

**My Finance Track** is a modern, high-performance financial management application built to help users take complete control of their financial life. It bridges seamless manual tracking with intelligent machine-assisted financial advice:

- 💸 **Track Daily Incomes & Outlays**: Real-time recording with categorization, payment method tracking, and merchant tagging.
- 🎯 **Budget Responsibly**: Set spending limits across custom categories with visual threshold alerts before overspending occurs.
- 🏆 **Fulfill Savings Goals**: Visualize progress toward big milestones (Emergency Funds, Vacations, Investments) with progress bars and contribution logs.
- 🤖 **Groq-Powered AI Financial Advisor**: Get instant financial health checks, smart saving tips, and contextual responses from an ultra-fast LLM assistant.
- 📊 **Visual Analytics & Reporting**: Drill down into cash flows, anomaly spending patterns, and generate exportable PDF and Excel/CSV reports.

---

## 📸 Application Previews & Screenshots

### 📊 1. Executive Dashboard
> Comprehensive personal wealth hub displaying live net balance, monthly income/expenses, interactive cash flow charts, category breakdown donut, and recent activity logs.

<p align="center">
  <img src="screenshots/01-dashboard.png" alt="Executive Dashboard" width="100%" />
</p>

---

### 🤖 2. Groq-Powered AI Financial Advisor
> Conversational AI advisor powered by Groq's high-speed inference engine. Provides instant audits, spending anomaly detection, and actionable budget recommendations with persistent context memory.

<p align="center">
  <img src="screenshots/06-ai-insights.png" alt="AI Financial Advisor & Insights" width="100%" />
</p>

---

### 📈 3. Deep Analytics & Cash Flow Trends
> Interactive visual metrics featuring longitudinal income vs. expenses curves, category distribution, spending velocity, and monthly comparison heatmaps powered by Chart.js and Recharts.

<p align="center">
  <img src="screenshots/02-analytics.png" alt="Financial Analytics Hub" width="100%" />
</p>

---

### 🎯 4. Smart Category Budgets & Limit Alerts
> Create custom monthly spending caps with live visual progress bars (Safe 🟢, Near Limit 🟡, Exceeded 🔴) to keep discretionary spending in check.

<p align="center">
  <img src="screenshots/03-budgets.png" alt="Budget Management & Limits" width="100%" />
</p>

---

### 📄 5. Financial Reports & Multi-Format Exports
> In-depth breakdown by month, category, and payment method with one-click export to PDF and Excel/CSV, plus scheduled delivery cadence.

<p align="center">
  <img src="screenshots/05-reports.png" alt="Reports & Export Suite" width="100%" />
</p>

---

### 🌐 6. Modern Landing Page & 🔐 Dual Authentication
> Sleek glassmorphic dark-theme marketing showcase and secure sign-in portal supporting both Google OAuth 2.0 and JWT credentials.

| 🌐 Modern Landing Page | 🔐 Dual Authentication Portal |
|:---:|:---:|
| <img src="screenshots/landing-hero.png" width="100%" alt="Landing Page Hero" /> | <img src="screenshots/auth-login.png" width="100%" alt="Login Portal" /> |

---

## ✨ Key Features

### 1. 📊 Central Executive Dashboard
- **Real-Time Financial Metrics**: Instant snapshot of Total Balance, Monthly Income, Monthly Expenses, and Savings Rate.
- **Interactive Visualizations**: Cash flow comparison charts, spending velocity, and recent transaction feeds.
- **Quick Actions**: Rapidly log expenses, record incomes, or jump directly into AI financial consultations.

### 2. 💳 Income & Expense Management
- Record transactions with amount, category, date, payment method (`UPI`, `Credit Card`, `Debit Card`, `Net Banking`, `Cash`), and merchant/vendor notes.
- In-place editing and deletion with immediate balance recalculation.
- Filter and search records by date range, merchant, or tag.

### 3. 📑 Consolidated Transaction Ledger
- Unified ledger showing both incoming and outgoing cash flows.
- Multi-dimensional filters: category, payment mode, transaction type, and keyword search.
- Responsive pagination and clean sorting for high transaction volume.

### 4. 🎯 Smart Budgeting & Alerts
- Create category-specific monthly spending limits (e.g., Dining, Groceries, Shopping, Bills).
- Visual progress meters with color-coded warnings (Safe 🟢, Near Limit 🟡, Exceeded 🔴).
- Real-time remaining budget calculations.

### 5. 🏆 Savings Goals & Milestones
- Set up target goals with custom target amounts and deadlines.
- Track progress percentage and remaining duration.
- Incremental savings contribution modal to record money moved toward each goal.
- Goal status management: `In Progress`, `Completed`, or `Paused`.

### 6. 🤖 AI Financial Advisor (Powered by Groq)
- **Natural Language Chat**: Ask questions such as *"How can I reduce my dining spend by 15%?"* or *"Analyze my spending habits for this month"*.
- **Deep Financial Health Check**: Generates detailed markdown reports evaluating spending-to-income ratio, risk areas, and actionable recommendations.
- **High Speed & Redundancy**: Built using Groq's low-latency inference engine with automatic fallback (`openai/gpt-oss-120b` and `llama-3.3-70b-versatile`).
- **Persistent Chat History**: Review past financial advice or clear history at any time.

### 7. 📈 Advanced Analytics & Anomaly Detection
- **Category Breakdown**: Interactive doughnut charts displaying top expenditure categories.
- **Monthly Spending Trends**: Longitudinal bar and area charts powered by Chart.js and Recharts.
- **Unusual Spending Detector**: Flags abnormal spike transactions compared to historical averages.
- **Predictive Savings Model**: Forecasts end-of-month savings based on current burn rate.

### 8. 📄 Financial Reports & Multi-Format Exports
- Comprehensive breakdown by month, category, and payment method.
- **Export Formats**: One-click PDF summaries and CSV/Excel downloads.
- **Share & Schedule**: Quick Web Share API / clipboard export, plus automated report scheduling cadence configuration.

### 9. 🏷️ Category Management
- Pre-configured standard categories (Salary, Freelance, Groceries, Dining, Rent, Utilities, etc.).
- Add custom income and expense categories tailored to your workflow with customizable color tags.

### 10. 🔐 Dual Authentication & Security
- **Email & Password**: Salted password hashing with `bcrypt` and stateless `JWT` session tokens.
- **Google OAuth 2.0**: Fast, one-click sign-in via Google accounts powered by `Passport.js`.
- **Protected Routes**: Secure endpoints and client-side guards preventing unauthorized data access.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/), [Vite](https://vitejs.dev/) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) Icons |
| **Routing & State** | [React Router DOM v7](https://reactrouter.com/), Context API (`AuthContext`) |
| **Charts & Visualizations** | [Chart.js](https://www.chartjs.org/), [React-ChartJS-2](https://react-chartjs-2.js.org/), [Recharts](https://recharts.org/) |
| **Markdown & Formatting** | [React Markdown](https://github.com/remarkjs/react-markdown), [Remark GFM](https://github.com/remarkjs/remark-gfm) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Backend Runtime** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) (v5) |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/) |
| **Authentication** | [Passport.js](http://www.passportjs.org/) (`passport-google-oauth20`), [jsonwebtoken (JWT)](https://jwt.io/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **AI / LLM Engine** | [Groq SDK](https://groq.com/) (`gpt-oss-120b` / `llama-3.3-70b-versatile`) |
| **Deployment** | [Vercel](https://vercel.com/) (Frontend), [Render](https://render.com/) (Backend), [MongoDB Atlas](https://www.mongodb.com/atlas) (Database) |

---

## 📐 System Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Vercel)"]
        UI["React 19 + Tailwind v4 + Vite"]
        Router["React Router v7"]
        Charts["Chart.js & Recharts"]
        AuthContext["Auth Context & Axios Interceptors"]
    end

    subgraph API ["Server Layer (Render)"]
        Express["Express.js Server (/aft/api/v1)"]
        Passport["Passport.js (Google OAuth2)"]
        JWTMiddleware["JWT Authentication Guard"]
        Controllers["Controllers (Income, Expense, Budget, Goals, Analytics, AI)"]
        GroqService["Groq AI Engine"]
    end

    subgraph External ["External Services"]
        MongoAtlas[("MongoDB Atlas Database")]
        GroqCloud["Groq Cloud LLM API"]
        GoogleAuth["Google Identity Platform"]
    end

    UI --> Router
    Router --> AuthContext
    AuthContext --> Express
    Express --> JWTMiddleware
    JWTMiddleware --> Controllers
    Passport <--> GoogleAuth
    Controllers --> MongoAtlas
    Controllers --> GroqService
    GroqService <--> GroqCloud
```

---

## 📁 Directory Structure

```text
finance-tracker/
├── backend/
│   ├── config/              # Database connection, Passport OAuth, environment loaders
│   ├── controllers/         # Request handling & HTTP response formatting
│   │   ├── ai.controller.js
│   │   ├── analytics.controller.js
│   │   ├── auth.controller.js
│   │   ├── budget.controller.js
│   │   ├── category.controller.js
│   │   ├── expense.controller.js
│   │   ├── goal.controller.js
│   │   ├── income.controller.js
│   │   ├── report.controller.js
│   │   └── user.controller.js
│   ├── middlewares/         # Validation and JWT authentication guards
│   ├── models/              # Mongoose schemas (User, Income, Expense, Budget, Goal, etc.)
│   ├── routes/              # Express route declarations (prefixed with /aft/api/v1)
│   ├── services/            # Core business logic & external integrations
│   │   ├── ai/              # Groq SDK AI prompt engineering & chat orchestrator
│   │   └── ...              # Analytics, reporting, calculation engines
│   ├── utils/               # Standardized response formatters & helpers
│   ├── .env.example         # Template for backend environment variables
│   ├── index.js             # Express application entry point
│   └── package.json
│
├── frontend/
│   ├── public/              # Static assets and favicon
│   ├── src/
│   │   ├── assets/          # Images, illustrations, and SVG graphics
│   │   ├── components/      # Modular UI components
│   │   │   ├── dashboard/   # Summary cards, charts, and metric displays
│   │   │   ├── layout/      # Sidebar navigation, top Navbar, modals
│   │   │   ├── reports/     # Report action bars, filters, breakdown cards
│   │   │   └── ui/          # Reusable inputs, buttons, badges
│   │   ├── context/         # AuthContext and application global state
│   │   ├── hooks/           # Custom React hooks (useAuth, etc.)
│   │   ├── pages/           # Route views
│   │   │   ├── Home.jsx           # Landing page with feature showcases
│   │   │   ├── Dashboard.jsx      # Central metrics hub
│   │   │   ├── Income.jsx         # Income source logging
│   │   │   ├── Expenses.jsx       # Expense tracking
│   │   │   ├── Transactions.jsx   # Consolidated ledger
│   │   │   ├── Budgets.jsx        # Budget limits & progress
│   │   │   ├── Goals.jsx          # Savings goals & contribution tracker
│   │   │   ├── AIInsights.jsx     # AI Advisor chat & financial health checks
│   │   │   ├── Analytics.jsx      # Longitudinal charts & anomaly detector
│   │   │   ├── Reports.jsx        # Monthly/yearly reports & export
│   │   │   ├── Categories.jsx     # Custom category management
│   │   │   ├── Settings.jsx       # User profile, currency & preferences
│   │   │   ├── Login.jsx          # Sign In page (Email + Google OAuth)
│   │   │   └── Signup.jsx         # Account registration page
│   │   ├── routes/          # ProtectedRoute guard wrapper
│   │   ├── services/        # Axios API client instance with interceptors
│   │   ├── utils/           # Currency and date formatters
│   │   ├── App.jsx          # Application route definitions
│   │   ├── index.css        # Tailwind CSS directives & global dark theme
│   │   └── main.jsx         # React root mounting
│   ├── .env.example         # Template for frontend environment variables
│   ├── vite.config.js       # Vite configuration with Tailwind CSS v4
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm** or **yarn** / **pnpm**
- **MongoDB**: A local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI
- **Groq API Key**: Free API key from [Groq Console](https://console.groq.com)
- **Google OAuth Credentials** *(Optional for Google Sign-In)*: Configured via [Google Cloud Console](https://console.cloud.google.com/)

---

### 1. Clone Repository

```bash
git clone https://github.com/iamaby-0/finance-tracker.git
cd finance-tracker
```

---

### 2. Backend Setup

1. **Navigate into the backend directory:**
   ```bash
   cd backend
   ```

2. **Install backend dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual credentials:
   ```env
   PORT=3000
   DB_NAME=finance-tracker
   DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/finance-tracker
   JWT_SECRET=your_jwt_secret_key_here
   GROQ_API_KEY=gsk_your_groq_api_key_here
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/aft/api/v1/auth/google/callback
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the backend development server:**
   ```bash
   npm start
   ```
   *The backend server will run on `http://localhost:3000`.*

---

### 3. Frontend Setup

1. **Open a new terminal window and navigate into the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure the API endpoint points to your running backend:
   ```env
   VITE_API_URL=http://localhost:3000/aft/api/v1
   ```

4. **Launch the frontend development server:**
   ```bash
   npm run dev
   ```
   *Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required | Example |
|---|---|:---:|---|
| `PORT` | Port for the Express server to listen on | No *(Default: 3000)* | `3000` |
| `DB_NAME` | MongoDB database name | Yes | `finance-tracker` |
| `DB_URL` | MongoDB connection connection URI | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | Yes | `a_long_random_secure_secret_string` |
| `GROQ_API_KEY` | API Key from Groq Cloud for AI insights and chat | Yes | `gsk_abc123...` |
| `GOOGLE_CLIENT_ID` | Client ID from Google Cloud OAuth 2.0 Credentials | Optional | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Client Secret from Google Cloud OAuth 2.0 | Optional | `GOCSPX-xxxxxx` |
| `GOOGLE_CALLBACK_URL` | OAuth redirect URL registered in Google Console | Optional | `http://localhost:3000/aft/api/v1/auth/google/callback` |
| `FRONTEND_URL` | Origin of the frontend application (for CORS) | Yes | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description | Required | Example |
|---|---|:---:|---|
| `VITE_API_URL` | Base URL of the backend REST API | Yes | `http://localhost:3000/aft/api/v1` |

---

## 📡 API Reference

All backend routes are versioned under the base prefix `/aft/api/v1`.

### 🔐 Authentication (`/aft/api/v1/auth`)
| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `POST` | `/auth/signup` | Public | Register a new user account |
| `POST` | `/auth/signin` | Public | Authenticate user and receive JWT token |
| `GET` | `/auth/google` | Public | Trigger Google OAuth 2.0 redirection flow |
| `GET` | `/auth/google/callback`| Public | Google OAuth 2.0 callback and token exchange |

### 👤 User & Profile (`/aft/api/v1/user`)
| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `GET` | `/user/profile` | Auth | Get current authenticated user profile & preferences |
| `PUT` | `/user/profile` | Auth | Update user profile details |
| `PUT` | `/user/preferences` | Auth | Update user currency & display preferences |
| `PUT` | `/user/notifications`| Auth | Toggle user notification preferences |
| `POST` | `/user/change-password`| Auth | Change user password |
| `GET` | `/user/storage-usage`| Auth | Get user account storage usage statistics |
| `GET` | `/user/export-data` | Auth | Export all personal user data as JSON |
| `POST` | `/user/delete-account`| Auth | Permanently delete account and associated records |

### 💰 Income Management (`/aft/api/v1/income`)
| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `GET` | `/income` | Auth | Fetch all income records for current user |
| `POST` | `/income` | Auth | Record a new income entry |
| `GET` | `/income/:id` | Auth | Retrieve single income record by ID |
| `PATCH`| `/income/:id` | Auth | Update an existing income record |
| `DELETE`| `/income/:id` | Auth | Delete an income record |

### 💳 Expense Management (`/aft/api/v1/expenses`)
| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `GET` | `/expenses` | Auth | Fetch all expense records for current user |
| `POST` | `/expenses` | Auth | Record a new expense entry |
| `GET` | `/expenses/:id` | Auth | Retrieve single expense record by ID |
| `PATCH`| `/expenses/:id` | Auth | Update an existing expense record |
| `DELETE`| `/expenses/:id` | Auth | Delete an expense record |

### 🎯 Budget Management (`/aft/api/v1/budget` / `/aft/api/v1/budgets`)
| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `GET` | `/budgets` | Auth | Fetch all active budgets and spending progress |
| `POST` | `/budgets` | Auth | Create a new category budget limit |
| `GET` | `/budgets/:id` | Auth | Retrieve a single budget by ID |
| `PATCH`| `/budgets/:id` | Auth | Update budget limit or attributes |
| `DELETE`| `/budgets/:id` | Auth | Remove a budget |

### 🏆 Savings Goals (`/aft/api/v1/goals`)
| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `GET` | `/goals` | Auth | Fetch all savings goals |
| `POST` | `/goals` | Auth | Create a new savings target |
| `GET` | `/goals/:id` | Auth | Get goal details by ID |
| `PUT` / `PATCH` | `/goals/:id` | Auth | Update goal parameters |
| `DELETE`| `/goals/:id` | Auth | Delete a goal |
| `POST` | `/goals/:id/savings` | Auth | Add a savings deposit contribution toward goal |
| `GET` | `/goals/analytics` | Auth | Summary metrics of all active and completed goals |
| `POST` | `/goals/seed` | Auth | Seed default starter goals if list is empty |

### 🤖 AI Insights & Assistant (`/aft/api/v1/ai`)
| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `GET` | `/ai/financial-insights` | Auth | Generate comprehensive AI financial audit & health check |
| `POST` | `/ai/chat` | Auth | Send a prompt to Groq AI Financial Advisor with user context |
| `GET` | `/ai/chat/history` | Auth | Fetch conversation chat history |
| `DELETE`| `/ai/chat/clear` | Auth | Clear existing AI chat messages |

### 📊 Analytics (`/aft/api/v1/analytics`)
| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `GET` | `/analytics/summary` | Auth | Fetch monthly summary totals and net balance |
| `GET` | `/analytics/categories` | Auth | Spending breakdown grouped by category |
| `GET` | `/analytics/trends` | Auth | Historical spending trends across recent months |
| `GET` | `/analytics/unusual-spending` | Auth | Highlight anomaly / spike transactions |
| `GET` | `/analytics/savings-prediction` | Auth | Predictive end-of-month savings calculation |

### 📑 Reports & Categories (`/aft/api/v1/report`, `/aft/api/v1/categories`)
| Method | Endpoint | Access | Description |
|---|---|:---:|---|
| `GET` | `/report/monthly-report` | Auth | Aggregate monthly financial report |
| `GET` | `/report/yearly-report` | Auth | Aggregate annual financial report |
| `GET` | `/categories` | Auth | List default and user custom categories |
| `POST` | `/categories` | Auth | Create a new custom category |
| `DELETE`| `/categories/:id` | Auth | Delete a custom category |

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push your changes to GitHub.
2. Import the repository into [Vercel](https://vercel.com/).
3. Set **Root Directory** to `frontend`.
4. Configure the Build Command: `npm run build` and Output Directory: `dist`.
5. Add the Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/aft/api/v1`
6. Deploy!

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `npm install`.
5. Set **Start Command**: `node index.js`.
6. Add the necessary Environment Variables (`DB_URL`, `JWT_SECRET`, `GROQ_API_KEY`, `FRONTEND_URL`, etc.).
7. Deploy!

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `package.json` for details.

---

<p align="center">
  Built with ❤️ for better financial freedom.
</p>
