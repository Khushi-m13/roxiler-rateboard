# RateBoard — 5 minute Windows setup

## 1. MySQL

Open MySQL Workbench and run `database/schema.sql`.

## 2. Backend environment

Copy:

`backend/.env.example` -> `backend/.env`

Set `DB_PASSWORD` to your local MySQL password. Keep the rest as shown unless your MySQL installation uses different values.

## 3. Install and seed

Open PowerShell in the project folder:

```powershell
cd backend
npm install
npm run db:seed
```

The seed command generates a bcrypt hash for `Password@1` and inserts demo data.

## 4. Start backend

Keep this terminal open:

```powershell
npm run dev
```

Expected:

```text
MySQL connection established: rateboard
RateBoard API running on http://localhost:5000
```

## 5. Start frontend

Open a second PowerShell terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Demo accounts

All demo accounts use `Password@1`:

- `admin@rateboard.example.com`
- `aarav@example.com`
- `meera@example.com`
- `owner1@example.com`
- `owner2@example.com`

## If the backend says Missing environment variable

Check that the file is exactly:

`backend/.env`

not:

`backend/.env.txt`

Then restart `npm run dev`.
