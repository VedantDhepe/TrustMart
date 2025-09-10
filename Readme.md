# TrustMart

A modern, secure web application for store ratings, featuring robust **Role-Based Access Control** (RBAC) for System Administrators, Store Owners, and Normal Users.

Live Demo: [https://trustmart.onrender.com](https://trustmart.onrender.com)

---

## About

**TrustMart** allows users to register, log in, view stores, and submit or update store ratings from 1 to 5 stars. With strong role management, each user only sees the features and data permitted by their role. System administrators can fully manage users, stores, and all ratings through an intuitive dashboard.

---

## Features

- **Role-Based Authentication** (Admin / Store Owner / Normal User)
- **Email & Password Login** via Passport.js & Express Sessions
- **Store Ratings**
  - All users can rate stores from 1 to 5 stars
  - Ability to update/modify your submitted rating
- **Admin Dashboard**
  - See totals: users, stores, ratings
  - Add/edit/delete users (all roles) & stores
  - List, sort, and filter users and stores on key fields
  - See store details including average rating
- **Store Owner Dashboard**
  - See a list of users who rated their stores
  - See average rating of their store(s)
- **User Portal**
  - Register and log in
  - Update your password
  - View all registered stores and search by name/address
  - See your submitted rating and update it if needed
- **Form Validation**
  - Name: 20–60 characters, Address: ≤400, Email: strict standard, Password: 8–16 characters with uppercase & special char
- **Sorting & Filtering** on all listings (Name, Email, Address, Role)
- **Secure Session Management**
- **RESTful APIs with MVC Structure**
- **Responsive UI, modern user experience**

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Express.js, Node.js (MVC Structure)
- **Database:** PostgreSQL
- **Authentication:** Passport.js (Sessions, Email/Password)
- **Deployment:** Render

---

## Screenshots

_Add screenshots:_

_Path/to/images can be customized as per files in your project._

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL

---

### Installation

#### 1. Clone the repository:
```
git clone https://github.com/yourusername/trustmate.git
cd trustmate
```

#### 2. **Backend Setup**
```
cd backend
npm install
```
Create a `.env` file with:


```
DB_HOST=localhost
DB_USER=postgres
DB_PORT=YourDatabasePort
DB_PASSWORD=YourPassword
DB_DATABASE=YourDatabaseName
SESSION_SECRET=YourSessionSecret
PORT=YourPort
```


Start the backend:

```
npm start

```


#### 3. **Frontend Setup**
```
cd ../frontend
npm install
```

Create a `.env` file with:

```
VITE_API_URL=your_backend_host
```

Start the frontend:

```
npm run dev
```

Open [http://localhost:YourFrontendPort](http://localhost:YourFrontendPort) in your browser.

---

## API Endpoints

Full details in [`API_NAVIGATION.txt`](./API_NAVIGATION.txt).  
Key endpoints include:

| Method | Path                           | Description                                | Auth         | Roles                |
|--------|--------------------------------|--------------------------------------------|--------------|----------------------|
| POST   | `/api/auth/register`           | Register new user (normal/owner)           | No           | Anyone               |
| POST   | `/api/auth/login`              | Login                                      | No           | Anyone               |
| GET    | `/api/users`                   | List/filter/sort all users                 | Yes          | Admin                |
| POST   | `/api/users/register`          | Admin creates user                         | Yes          | Admin                |
| GET    | `/api/stores`                  | List/search all stores, view avg & user rating | Yes     | Any logged in        |
| POST   | `/api/stores`                  | Create store                               | Yes          | Admin, Owner         |
| GET    | `/api/stores/all`              | Admin list/filter/sort stores              | Yes          | Admin                |
| POST   | `/api/ratings`                 | Submit/update rating for a store           | Yes          | User / Owner         |
| GET    | `/api/ratings/owner-dashboard` | Owner dashboard for ratings                | Yes          | Store Owner          |
| GET    | `/api/dashboard/totals`        | Dashboard totals for admin                 | Yes          | Admin                |

And more—see API_NAVIGATION.txt for the full matrix.





## Acknowledgements

- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Node.js](https://nodejs.org/)
- [Passport.js](http://www.passportjs.org/)
- [Render](https://render.com/)
- And all contributors!

---

## License

Open-source for educational and development use.

---

*This app uses an MVC file structure for backend maintainability and separation of concerns.*
