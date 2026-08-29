RateBoard 

RateBoard is a web application for managing stores and their ratings. It has three types of users — System Administrator, Normal User and Store Owner. Each user gets different access after login depending on their role.

I built this project using React for the frontend, Node.js and Express for the backend, and MySQL for storing the application data.

What the application does

The main idea of the application is simple:

Admin manages users and stores.
Normal users can find stores and give ratings.
Store owners can check the ratings received by their store.

The application uses one login page for all three roles. After login, the user is automatically taken to the section available for their role.

User Roles
System Administrator

The administrator has access to the overall system.

From the Admin Dashboard, an administrator can:

See total users, stores and ratings.
Add users.
Add administrator accounts.
Add stores.
Assign a store to a store owner.
View users and their details.
Edit user information.
Remove users.
Search/filter users.
Sort users and store listings.
View store information and ratings.

The administrator account cannot be created from the normal public registration page. This is intentional so that anyone cannot simply register themselves as an administrator.

Normal User

A normal user can:

Create an account.
Login to the application.
View registered stores.
Search stores by name or address.
Check the overall rating of a store.
Give a rating between 1 and 5.
See their own rating.
Change their rating later.
Change their password.
Logout.
Store Owner

A store owner can:

Login to the application.
View their assigned store.
See the average rating of their store.
See the users who have rated the store.
Check rating activity and rating distribution.
Change their password.
Logout.

A store owner can only access rating information related to their assigned store.

Registration and Login

The public registration page provides two choices:

Normal User
Store Owner

Administrator accounts are created by an existing administrator.

There is no role selection on the login page. The backend identifies the role of the logged-in account and the frontend redirects the user accordingly.

Admin        → Admin Dashboard
Normal User  → Store Directory
Store Owner  → Owner Dashboard
Password Validation

The registration form validates the password before creating the account.

The password must:

Be between 8 and 16 characters.
Contain at least one uppercase letter.
Contain at least one special character.

Passwords are hashed using bcryptjs before being stored in the database.

Store and Rating Flow

Stores added through the Admin Dashboard are saved in MySQL and become available in the Normal User store directory.

The normal user can search for the store, open its details and submit a rating.

For a store that the user has already rated, the application shows the existing rating and allows it to be updated.

The Store Owner dashboard uses the stored ratings to calculate the average rating and display rating activity.

Technologies Used
Frontend
React
Vite
JavaScript
React Router
Axios
CSS
Backend
Node.js
Express.js
REST APIs
JWT
bcryptjs
dotenv
CORS
Database
MySQL
mysql2
Project Structure
roxiler-rateboard/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── ...
│   └── package.json
│
├── database/
├── .gitignore
└── README.md
Running the Project Locally
Requirements

Before running the project, make sure these are installed:

Node.js
npm
MySQL
Git

You can check Node and npm using:

node --version
npm --version
1. Clone the project
git clone https://github.com/Khushi-m13/roxiler-rateboard
cd roxiler-rateboard
2. Set up MySQL

Create the database:

CREATE DATABASE rateboard;

Make sure the MySQL server is running.

3. Configure the backend

Go to the backend folder:

cd backend

Create a .env file using .env.example as a reference.

Example:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rateboard
JWT_SECRET=your_generated_secret
PORT=5000

The actual .env file should not be uploaded to GitHub.

4. Install backend packages
npm install

If the project contains the database seed command, run:

npm run db:seed

Start the backend:

npm run dev

The backend runs on:

http://localhost:5000
5. Install frontend packages

Open another terminal:

cd frontend
npm install

Start the frontend:

npm run dev

Open the URL shown by Vite, normally:

http://localhost:5173
Application Flow

The basic flow of the application is:

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

For a normal user:

Register
   ↓
Login
   ↓
Search Stores
   ↓
Open Store
   ↓
Submit Rating
   ↓
Update Rating if required

For a store owner:

Login
   ↓
Owner Dashboard
   ↓
Assigned Store
   ↓
Average Rating
   ↓
Rating Activity
Security

Some basic security measures included in the project are:

Passwords are hashed before being stored.
JWT is used for authentication.
Protected routes require authentication.
Different roles have different permissions.
Administrator registration is not publicly available.
Store owners can only access their own store's rating information.
Database credentials and JWT secrets are stored in environment variables.
.env is excluded from Git.
Validation

The application follows the validation requirements given in the assessment.

Name

20 to 60 characters.

Address

Maximum 400 characters.

Email

A valid email format is required.

Password

8 to 16 characters with at least:

One uppercase letter
One special character
Rating

Ratings are allowed from 1 to 5.

Testing the Application

The main workflows I tested are:

Normal user registration and login.
Store owner registration and login.
Administrator login.
Role-based redirection after login.
Store creation from the Admin Dashboard.
Store visibility in the Normal User store directory.
Store search.
Rating submission.
Rating update.
Store owner rating dashboard.
User editing from the Admin Dashboard.
User removal.
Password validation.
Protected role-based pages.

When testing locally, use separate test accounts for the three roles.

Important Notes

The application is intended to run locally with a MySQL database.

The .env file is not included in the repository because it contains local database credentials and the JWT secret. Use .env.example to create your own configuration.

node_modules is also not included. Run npm install inside both the backend and frontend folders after cloning the project.

Assessment

This project was developed as part of the Roxiler Systems Full Stack Developer assessment.

The implementation covers the required:

React frontend
Node.js/Express backend
MySQL database
Three user roles
Authentication
Role-based access
Store management
User management
Store search
Store ratings
Rating updates
Store owner dashboard
Admin dashboard
Form validation
Sorting and filtering
Author

Khushi Bandpatte

Computer Science & Engineering
2027
