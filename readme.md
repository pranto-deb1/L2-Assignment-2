# DevPulse 🚼

**DevPulse** is a collaborative internal tech issue and feature tracker designed for software engineering teams. It allows teams to report bugs, suggest features, coordinate resolutions, and manage workflows efficiently without overhead.

**Live Project URL:** [Live_Link](https://dev-pulse-rho-six.vercel.app/)

---

## 🚀 Features

- **Role-Based Access Control (RBAC):** Supports `contributor` and `maintainer` roles with strict workspace permission layers.
- **Secure Authentication:** JWT-based secure session management with salted password hashing via `bcrypt`.
- **Advanced Issue Management:** Create, read, and multi-tier update rules for handling bug reports and feature requests.
- **Raw SQL Execution:** High-performance database interaction using raw PostgreSQL queries, built entirely without ORMs or SQL JOINs (Application-level data stitching).
- **Dynamic Diagnostics:** Robust server-side input validation and a centralized error-handling pipeline.

---

## 🛠️ Technology Stack

- **Runtime:** Node.js (LTS v24.x or higher)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Security:** `bcrypt` (Password hashing) & `jsonwebtoken` (JWT standard tokens)

---

## 🗄️ Database Schema Summary

The database is built purely on relational grounds using decoupled entity structures. No physical Foreign Key constraints are utilized; consistency is enforced via application logic.

### 1. `users` Table

| Field        | Type         | Modifiers / Constraints                                                        |
| :----------- | :----------- | :----------------------------------------------------------------------------- |
| `id`         | SERIAL       | PRIMARY KEY                                                                    |
| `name`       | VARCHAR(255) | NOT NULL                                                                       |
| `email`      | VARCHAR(255) | NOT NULL, UNIQUE                                                               |
| `password`   | VARCHAR(255) | NOT NULL                                                                       |
| `role`       | VARCHAR(20)  | NOT NULL, DEFAULT 'contributor', CHECK (role IN ('contributor', 'maintainer')) |
| `created_at` | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                                      |
| `updated_at` | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                                      |

### 2. `issues` Table

| Field         | Type         | Modifiers / Constraints                                                         |
| :------------ | :----------- | :------------------------------------------------------------------------------ |
| `id`          | SERIAL       | PRIMARY KEY                                                                     |
| `title`       | VARCHAR(150) | NOT NULL                                                                        |
| `description` | TEXT         | NOT NULL, CHECK (LENGTH(description) >= 20)                                     |
| `type`        | VARCHAR(20)  | NOT NULL, CHECK (type IN ('bug', 'feature_request'))                            |
| `status`      | VARCHAR(20)  | NOT NULL, DEFAULT 'open', CHECK (status IN ('open', 'in_progress', 'resolved')) |
| `reporter_id` | INTEGER      | NOT NULL (Validated in App Logic)                                               |
| `created_at`  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                                       |
| `updated_at`  | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP                                                       |

---

## 🌐 API Endpoints Specification

### 🔹 Authentication Module

- `POST /api/auth/signup` - Register a new account (`contributor` / `maintainer`). _Access: Public_
- `POST /api/auth/login` - Authenticate credentials and receive a JWT. _Access: Public_

### 🔹 Issues Module

- `POST /api/issues` - Create a new bug report or feature request. _Access: Authenticated_
- `GET /api/issues` - Retrieve all issues with optional filtering (`type`, `status`) and sorting (`newest`, `oldest`). _Access: Public_
- `GET /api/issues/:id` - Retrieve full details of a specific issue. _Access: Public_
- `PUT /api/issues/:id` - Update issue fields. (Maintainers can edit all; Contributors can only edit their own `open` issues). _Access: Authenticated_
- `DELETE /api/issues/:id` - Permanently remove an issue. _Access: Maintainer Only_

---

## 💻 Setup and Installation Steps

Follow these instructions to get a local copy of the project up and running:

### 1. Clone the Repository

```bash
git clone [Project_link](https://github.com/pranto-deb1/L2-Assignment-2.git)
cd L2-Assignment-2
```

### 2. Install Project Dependencies

Run the following command to install all the required packages (Express, PostgreSQL client, TypeScript, etc.):

```bash
npm install
```

### 3. Configure Environment Variables

Create a file named .env in the root directory of the project and add the following variables with your actual credentials:

PORT=5000
CONNECTION_STRING=your_postgresql_database_connection_string
JWT_SECRET=your_super_secure_jwt_secret_key

### 4. Run Database Initialization & Start Server

The project is configured to automatically initialize the database tables upon startup.

```bash
npm run dev
```

### For Production Build & Start:

```bash
npm run build
npm start
```
