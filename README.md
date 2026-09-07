# 🌱 FarmersBook

### Web-Based Farm Management & Bookkeeping System

FarmersBook is a web-based application designed to help farmers digitally manage their farm lands, expenses, crop harvests, stock, sales, and financial records.

The system provides a simple alternative to manual record keeping by organizing farming and financial information in one centralized platform.

---

## 🎯 Objectives

- Digitize farm and financial record keeping.
- Manage multiple farm lands.
- Track different types of farming expenses.
- Record crop harvests and available stock.
- Manage crop sales and automatically calculate income.
- Update stock after every sale.
- Provide a dashboard for quick financial insights.
- Generate basic income, expense, and profit/loss reports.

---

## ✨ Key Features

### 🔐 User Management
- User registration and login
- JWT-based authentication
- Protected pages
- User authentication state

### 🌾 Land Management
- Add farm land
- View land details
- Edit land information
- Delete land
- Store plantation year and location details

### 🌱 Crop & Harvest Management
- Manage crop information
- Record harvested crops
- Store harvest quantity and date
- Associate harvests with specific lands
- Monitor available crop stock

### 💸 Expense Management
- Labour expenses
- Fertilizer/Pesticide expenses
- Transportation expenses
- Other expenses
- Add, edit, view and delete expenses

### 💰 Sales & Income
- Record crop sales
- Store buyer details
- Enter quantity and price per kg
- Automatically calculate total income
- Deduct sold quantity from available stock
- View sales history

### 📊 Dashboard & Reports
- Total income
- Total expenses
- Profit/Loss
- Current stock
- Recent activities
- Income reports
- Expense reports
- Profit/Loss reports
- Optional date-based filtering

---

## 🛠️ Technology Stack

### Frontend
- React.js
- React Router
- JavaScript
- HTML/CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Tokens (JWT)

### Development Tools
- Git
- GitHub
- VS Code
- Vite

---

## 📚 Concepts Used

### Module 3 — Client-Side Framework
- React Components
- JSX
- Props
- State
- `useState`
- `useEffect`
- Functional Components
- React Router
- Context API
- Custom Hooks
- Conditional Rendering
- Forms

### Module 4 — Server-Side Web Development
- Node.js
- Asynchronous Programming
- Express.js
- Routing
- Middleware
- REST APIs
- Form Handling
- MongoDB/Mongoose
- JWT Authentication

---

# 👥 Team & Work Distribution

The project is divided into four independent functional modules so that each team member contributes to both the frontend and backend.

| Member | Module | Main Responsibilities |
|---|---|---|
| **Nithya Shaji** | 🔐 Authentication + 🌾 Land Management | Login, registration, JWT, protected routes, user authentication, Land CRUD |
| **Roshni Michael** | 🌱 Crop + 🌾 Harvest + 📦 Stock | Crop management, harvest records, stock management and related APIs |
| **Nikitta Sony** | 💸 Expense Management | Labour, fertilizer/pesticide, transportation and other expenses |
| **Neha Suresh** | 💰 Sales + 📊 Dashboard + Reports | Sales, stock deduction after sale, income calculation, dashboard and financial reports |

Each member is responsible for implementing the frontend, backend APIs and database operations related to their assigned module.

---

## 🔄 Application Workflow

```text
Register / Login
       ↓
Manage Farm Lands
       ↓
Manage Crops
       ↓
Record Harvest
       ↓
Manage Available Stock
       ↓
Record Expenses
       ↓
Sell Crops
       ↓
Stock Automatically Updated
       ↓
Income Calculated
       ↓
Dashboard & Reports
       ↓
View Profit / Loss
