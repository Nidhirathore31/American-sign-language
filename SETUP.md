# Setup and Run Guide

Complete guide to set up and run the ASL Teacher Application locally.

## Prerequisites

- **Node.js 20+** installed
- **PostgreSQL 15+** installed and running (see [DATABASE.md](./DATABASE.md) for database setup)
- **npm** or **yarn**

## Quick Start

### Step 1: Setup and Start Backend (Terminal 1)

Open a PowerShell terminal and run:

```powershell
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

**Note**: Make sure PostgreSQL is running before starting the backend! See [DATABASE.md](./DATABASE.md) for database setup instructions.

The backend will start on `http://localhost:5000`

### Step 2: Setup and Start Frontend (Terminal 2)

Open a **NEW** PowerShell terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## All-in-One Commands (Copy & Paste)

### Windows PowerShell - Backend (Terminal 1):

```powershell
cd backend; npm install; npm run prisma:generate; npm run prisma:migrate; npm run dev
```

### Windows PowerShell - Frontend (Terminal 2):

```powershell
cd frontend; npm install; npm run dev
```

### Linux/Mac - Backend (Terminal 1):

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Linux/Mac - Frontend (Terminal 2):

```bash
cd frontend
npm install
npm run dev
```

---

## Detailed Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env` file** (if it doesn't exist):
   
   Create a file named `.env` in the `backend` directory with the following content:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/asl_db
   JWT_SECRET=your-secret-key-change-in-production
   PORT=5000
   NODE_ENV=development
   ```
   
   **Windows PowerShell** (to create the file automatically):
   ```powershell
   if (-not (Test-Path .env)) {
       @"
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/asl_db
   JWT_SECRET=your-secret-key-change-in-production
   PORT=5000
   NODE_ENV=development
   "@ | Out-File -FilePath .env -Encoding utf8
   }
   ```
   
   **Linux/Mac:**
   ```bash
   cp .env.example .env
   # Then edit .env with your database credentials
   ```

4. **Generate Prisma Client:**
   ```powershell
   npm run prisma:generate
   ```

5. **Run database migrations:**
   ```powershell
   npm run prisma:migrate
   ```

6. **Start the backend server:**
   ```powershell
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create `.env.local` file** (if it doesn't exist):
   
   Create a file named `.env.local` in the `frontend` directory with the following content:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   
   **Windows PowerShell** (to create the file automatically):
   ```powershell
   if (-not (Test-Path .env.local)) {
       "NEXT_PUBLIC_API_URL=http://localhost:5000/api" | Out-File -FilePath .env.local
   }
   ```
   
   **Linux/Mac:**
   ```bash
   cp .env.example .env.local
   # Then edit .env.local if needed
   ```

4. **Start the frontend server:**
   ```powershell
   npm run dev
   ```

---

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

---

## Troubleshooting

### PostgreSQL Not Running

If you get database connection errors, make sure PostgreSQL is running. See [DATABASE.md](./DATABASE.md) for detailed database setup instructions.

**Quick Docker option:**
```powershell
docker run --name asl-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=asl_db -p 5432:5432 -d postgres:15-alpine
```

### Port Already in Use

**Backend**: Change `PORT` in `backend/.env` file
**Frontend**: Change port by running `npm run dev -- -p 3001`

### Prisma Migration Fails

1. Make sure PostgreSQL is running
2. Check your `DATABASE_URL` in `backend/.env`
3. Verify PostgreSQL credentials are correct
4. Try resetting the database: `npm run prisma:migrate reset` (⚠️ **WARNING**: This deletes all data)
5. Or manually create the database: `createdb asl_db`

### Module Not Found Errors

**Windows PowerShell:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

**Linux/Mac:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Issues

- Verify `DATABASE_URL` is correct in `backend/.env`
- Ensure PostgreSQL is running
- Check firewall settings
- Verify PostgreSQL credentials match your `.env` file

---

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/asl_db
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Next Steps

Once the application is running:
1. Open http://localhost:3000 in your browser
2. Register a new account or login
3. Start learning ASL signs!

For database setup help, see [DATABASE.md](./DATABASE.md).
