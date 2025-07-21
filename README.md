# CashFlow - A Full-Stack Personal Finance Tracker

## 📖 About The Project

CashFlow is a full-stack web application designed to give you a clear, intuitive, and powerful way to track and manage your financial activities.

From a high-level monthly overview to detailed **interactive charts** 📊 and a filterable transaction history, this app provides all the tools needed to gain control over personal finances.

The standout feature is the **AI-powered OCR**, which uses the **Google Gemini 1.5 Flash model** to automatically extract transaction details from an uploaded receipt image, turning a tedious task into a seamless, two-click process.

---

## ✨ Key Features

* 🔐 **Secure Authentication:** User registration and login handled by **Clerk** for robust security.

* 🏠 **Interactive Dashboard:** A homepage with a high-level overview of monthly income, expenses, budget, and recent activity.

* 🤖 **Receipt Scanning:** Upload a receipt image, and the app's OCR will automatically parse the details and pre-fill the transaction form.

* ✍️ **CRUD Functionality:** Full Create, Read, Update, and Delete capabilities for all transactions.

* 📈 **Detailed Analysis Page:**
    * **Interactive Charts:** Bar and Pie charts from **Recharts** to visualize income vs. expenses and category breakdowns.
    * **Dynamic Time Filters:** View financial summaries for the last 7 days, 30 days, 3 months, or all time.
    * **Paginated Transaction Table:** An advanced, server-side paginated table that can handle thousands of transactions efficiently.
    * **Server-Side Filtering & Sorting:** Filter transactions by type, category, or search term, with all logic handled by the backend for performance.

* 🧠 **Centralized State Management:** Uses **Zustand** on the frontend for a clean, fast, and scalable state management solution.

* 🎨 **Modern UI:** A beautiful and responsive user interface built with **Shadcn UI**.

* 🔔 **Custom Toasts/Loaders:** Provides clear user feedback for all actions with custom-styled notifications.

---

## 🛠️ Tech Stack

### Frontend

* **Framework:** React (Vite)
* **Styling:** Tailwind CSS, Shadcn UI
* **State Management:** Zustand
* **Routing:** React Router
* **Data Fetching:** Axios
* **Charts:** Recharts

### Backend

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** Clerk
* **OCR:** Google Gemini 2.5 Flash
* **File Uploads:** Multer

---

## 📂 Folder Structure

<details>
<summary><strong>Backend Structure</strong></summary>

```
/CashFlow_backend
├── src/
│   ├── controllers/
│   │   ├── budget.controller.js
│   │   ├── receipt.controller.js
│   │   ├── transaction.controller.js
│   │   └── user.controller.js
│   ├── lib/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── budget.model.js
│   │   ├── transaction.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── budgetRoutes.js
│   │   ├── receiptRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── index.js         (Main Server File)
│   └── seed.js
├── .env
├── package.json
```

</details>

<details>
<summary><strong>Frontend Structure</strong></summary>

```
/CashFlow_frontend
├── src/
│   ├── components/
│   │   ├── ui/              (Shadcn UI components)
│   │   ├── BudgetDialog.jsx
│   │   ├── BudgetProgressCard.jsx
│   │   ├── Charts.jsx
│   │   ├── Navbar.jsx
│   │   ├── QuickStats.jsx
│   │   ├── RecentTransactions.jsx
│   │   ├── SetBudgetScreen.jsx
│   │   ├── TransactionDialog.jsx
│   │   └── TransactionTable.jsx
│   ├── hooks/
│   │   ├── useHomePageData.js
│   │   └── useReceiptScanner.js
│   ├── lib/
│   │   ├── apiClient.js
│   │   ├── toast.jsx
│   │   └── utils.js
│   ├── pages/
│   │   ├── AnalysisPage.jsx
│   │   ├── Home.jsx
│   │   └── Landing.jsx
│   ├── store/
│   │   ├── useBudgetStore.js
│   │   ├── useRegisterUser.js
│   │   ├── useSummary.js
│   │   └── useTransactionStore.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.local
├── package.json
└── vite.config.js
```

</details>

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* npm
* A MongoDB Atlas account (or a local MongoDB instance)
* API keys for Clerk and Google Gemini

### Backend Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/PrateekJaiswal16/CashFlow.git](https://github.com/PrateekJaiswal16/CashFlow.git)
    ```
2.  **Navigate to the backend directory:**
    ```sh
    cd CashFlow/backend
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Create a `.env` file** in the `backend` root and add the following variables:
    ```env
    PORT=4000
    MONGO_URI=your_mongodb_connection_string
    CLERK_SECRET_KEY=your_clerk_secret_key
    GEMINI_API_KEY=your_google_gemini_api_key
    FRONTEND_URL=http://localhost:5173
    ```
5.  **Run the seed script** to populate the database with sample data (optional):
    * Open `src/seed.js` and replace the placeholder `USER_ID` with your own Clerk User ID.
    * Run the script from the `backend` root folder:
        ```sh
        node src/seed.js
        ```
6.  **Start the server:**
    ```sh
    node src/index.js
    ```
    Your backend API will be running at `http://localhost:4000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd ../frontend
    ```
2.  **Install NPM packages:**
    ```sh
    npm install
    ```
3.  **Create a `.env.local` file** in the `frontend` root and add the following variables:
    ```env
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    VITE_API_URL=http://localhost:4000/api
    ```
4.  **Start the development server:**
    ```sh
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

---

## 📡 API Endpoints

All API endpoints are protected and require a valid Bearer Token for authentication.

| Method | Route                             | Description                                                               |
| :----- | :-------------------------------- | :------------------------------------------------------------------------ |
| `POST` | `/api/users/register`             | Creates a user record in the database. Triggered once after sign-up.      |
| `GET`  | `/api/budgets`                    | Fetches the current user's budget. Returns a default if none is set.      |
| `POST` | `/api/budgets`                    | Creates or updates the user's budget.                                     |
| `GET`  | `/api/transactions`               | Fetches a paginated, filtered, and sorted list of transactions.           |
| `POST` | `/api/transactions`               | Creates a new transaction.                                                |
| `PUT`  | `/api/transactions/:id`           | Updates a specific transaction by its ID.                                 |
| `DELETE`| `/api/transactions/:id`          | Deletes a specific transaction by its ID.                                 |
| `GET`  | `/api/transactions/summary`       | Fetches aggregated summary data for charts based on a time period.        |
| `POST` | `/api/receipts/scan`              | Scans an uploaded receipt image with AI and returns extracted JSON data.    |

---
## 🎬 Video Demo

[**Watch the video presentation here**](https://www.youtube.com) ---


## 📸 Screenshots

### Main Dashboard
*A high-level overview of the user's current financial status.*
![Main Dashboard Overview](https://github.com/user-attachments/assets/d0e30761-8ddb-4798-aafa-c169bb1916ca)

### Analysis Page & Charts
*Interactive charts with dynamic time-range filters for in-depth analysis.*
![Analysis Page with Charts and Time Ranges](https://github.com/user-attachments/assets/95891165-a86d-4977-ac94-598e65674527)

### Paginated & Filterable Table
*A powerful, server-side paginated table to handle large amounts of transaction data efficiently.*
![Paginated Table with Backend Handling](https://github.com/user-attachments/assets/c2f05b68-23ec-45ff-9cff-263c45c49503)

### Add/Edit with AI Receipt Scan
*The AI-powered dialog for adding or editing transactions by uploading a receipt.*
![Add/Edit Transaction Dialog with Uploading Receipt](https://github.com/user-attachments/assets/a1ef70a9-d883-4fb5-a3cc-99ce928f2d4b)

### Monthly Expense Breakdown
*A clear pie chart visualizing spending by category.*
![Monthly Expense Breakdown Pie Chart](https://github.com/user-attachments/assets/d64da4be-71e8-4c9d-8490-1cbc684622b8)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
