RateBoard

RateBoard is a web application for managing stores and their ratings. It supports three types of users — System Administrator, Normal User, and Store Owner — each with different access after login based on their role.

Built with React (frontend), Node.js + Express (backend), and MySQL (database).

What the Application Does

Admin manages users and stores.

Normal Users find stores and give ratings.

Store Owners check the ratings received by their store.

All three roles share a single login page. After login, each user is automatically taken to the section available for their role.

User Roles

System Administrator

From the Admin Dashboard, an administrator can:

View total users, stores, and ratings

Add users (normal users, store owners, and other administrators)

Add stores, and assign a store to a store owner

View, edit, and remove users

Search and filter users

Sort user and store listings

View store information and ratings

Administrator accounts cannot be created from the public registration page — only an existing administrator can create one.

Normal User

A normal user can:

Create an account and log in

View and search registered stores (by name or address)

Check a store's overall rating

Submit a rating (1–5) and update it later

Change their password

Log out

Store Owner

A store owner can:

Log in and view their assigned store

See their store's average rating

See which users have rated the store, and check rating activity

Change their password

Log out

A store owner can only access rating information for their own assigned store.

Registration and Login

The public registration page offers two account types:

Normal User

Store Owner

Administrator accounts are created only by an existing administrator — there is no admin option on the public registration page.

There is no role selector on the login page. The backend identifies the account's role from the database, and the frontend redirects accordingly:

Role

Redirects to

Admin

Admin Dashboard

Normal User

Store Directory

Store Owner

Owner Dashboard

Validation Rules

Field

Rule

Name

20–60 characters

Address

Max 400 characters

Email

Standard email format

Password

8–16 characters, at least 1 uppercase letter and 1 special character

Rating

Integer from 1 to 5

Passwords are hashed with bcryptjs before being stored — they are never stored or returned in plain text.

Technologies Used

Frontend: React, Vite, JavaScript, React Router, Axios, CSS
Backend: Node.js, Express.js, REST APIs, JWT, bcryptjs, dotenv, CORS
Database: MySQL, mysql2

Project Structure

The project is organized into three main parts:

roxiler-rateboard/
├── backend/      # Node.js + Express API
├── frontend/     # React + Vite application
├── database/     # MySQL schema and seed data
├── scripts/      # Windows setup/start scripts
├── README.md
└── .gitignore

Backend

backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   └── validators/
├── .env.example
└── package.json

Frontend

frontend/
├── src/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── styles/
├── .env.example
├── index.html
├── package.json
└── vite.config.js

Database and Scripts

database/
├── schema.sql
└── seed.sql

scripts/
├── setup-windows.bat
├── start-backend.bat
└── start-frontend.bat

Running the Project Locally

Requirements

Make sure these are installed before you start:

Node.js

npm

MySQL

Git

Check your Node and npm versions with:

node --version
npm --version

Step 1 — Clone the project

git clone https://github.com/Khushi-m13/roxiler-rateboard
cd roxiler-rateboard

Step 2 — Set up MySQL

Make sure your MySQL server is running, then create the database:

CREATE DATABASE rateboard;

Step 3 — Configure the backend

cd backend

Copy .env.example to a new file named .env in the backend folder, and fill in your own values:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rateboard
JWT_SECRET=your_generated_secret
PORT=5000

.env is excluded from Git — do not commit it.

Step 4 — Install backend packages and start the server

npm install
npm run db:seed   # optional: adds demo accounts and sample data
npm run dev

The backend runs at http://localhost:5000.

Step 5 — Install frontend packages and start the app

Open a new terminal window:

cd frontend
npm install
npm run dev

Open the URL shown by Vite — usually http://localhost:5173.

Application Flow

                    Login
                      |
          +-----------+-----------+
          |           |           |
        Admin        User        Owner
          |           |           |
          v           v           v
     Admin Panel   Stores      Owner Panel
          |
       Manage
    Users / Stores

Normal user flow:

Register

Log in

Search stores

Open a store

Submit a rating

Update the rating later, if needed

Store owner flow:

Log in

Open the Owner Dashboard

View the assigned store

Check the average rating

Review rating activity

Security

Passwords are hashed before being stored

JWT is used for authentication

Protected routes require authentication

Different roles have different permissions, enforced on the backend

Administrator registration is not publicly available

Store owners can only access their own store's rating data

Database credentials and the JWT secret are stored in environment variables

.env is excluded from Git

Testing the Application

Workflows tested during development:

Normal user registration and login

Store owner registration and login

Administrator login

Role-based redirection after login

Store creation from the Admin Dashboard

Store visibility in the Normal User directory

Store search

Rating submission and update

Store owner rating dashboard

User editing and removal from the Admin Dashboard

Password validation

Protected, role-based pages

When testing locally, use separate accounts for each of the three roles.

Important Notes

The application is intended to run locally with a MySQL database.

.env is not included in the repository — use .env.example as a starting point.

node_modules is not included — run npm install in both backend and frontend after cloning.

Assessment

This project was developed as part of the Roxiler Systems Full Stack Developer assessment. It covers:

React frontend

Node.js / Express backend

MySQL database

Three user roles with role-based access

Authentication (JWT)

Store and user management

Store search

Store ratings and rating updates

Store owner dashboard

Admin dashboard

Form validation

Sorting and filtering

Author

Khushi Bandpatte
Computer Science & Engineering, 2027