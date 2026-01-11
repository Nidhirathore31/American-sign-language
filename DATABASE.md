# Database Setup Guide

The application requires PostgreSQL to be running. Choose one of the options below to set up your database.

## Option 1: Using Docker (Recommended - Easiest)

If you have Docker Desktop installed, this is the simplest option:

### Start PostgreSQL Container

```powershell
docker run --name asl-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=asl_db -p 5432:5432 -d postgres:15-alpine
```

### Manage Docker Container

**Check if container is running:**
```powershell
docker ps
```

**Start the container if it's stopped:**
```powershell
docker start asl-postgres
```

**Stop the container:**
```powershell
docker stop asl-postgres
```

**Remove the container (if needed):**
```powershell
docker rm asl-postgres
```

---

## Option 2: Check if PostgreSQL is Already Installed

### Check PostgreSQL Service Status

**Windows PowerShell:**
```powershell
Get-Service -Name "*postgres*"
```

### Start PostgreSQL Service

If PostgreSQL is installed but not running:

**Windows Services (GUI):**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "postgresql-x64-15" (or similar version)
4. Right-click → Start

**PowerShell (as Administrator):**
```powershell
# Find the service name first
Get-Service -Name "*postgres*"

# Then start it (replace with actual service name)
net start postgresql-x64-15
```

**Linux/Mac:**
```bash
# Check status
sudo systemctl status postgresql

# Start service
sudo systemctl start postgresql
```

### Create Database (if needed)

If the database doesn't exist, create it:

```powershell
psql -U postgres
```

Then in the PostgreSQL prompt:
```sql
CREATE DATABASE asl_db;
\q
```

**Linux/Mac:**
```bash
createdb -U postgres asl_db
```

---

## Option 3: Install PostgreSQL

If PostgreSQL is not installed:

### Windows

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Or use installer: https://www.postgresql.org/download/windows/installer/

2. **Install with these recommended settings:**
   - Port: `5432` (default)
   - Username: `postgres`
   - Password: `postgres` (or set your own - remember to update `.env` file)
   - Database: Will be created during migration

3. **After installation, start the service** (see Option 2)

### Linux

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Create database:**
```bash
sudo -u postgres createdb asl_db
```

### Mac

**Using Homebrew:**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb asl_db
```

---

## Configure Environment Variables

After PostgreSQL is running, make sure your `backend/.env` file has the correct database connection:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/asl_db
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
```

**If your PostgreSQL has different credentials**, update the `DATABASE_URL`:
```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/asl_db
```

---

## After Starting Database

Once PostgreSQL is running:

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Run database migrations:**
   ```powershell
   npm run prisma:migrate
   ```

3. **Start the backend server:**
   ```powershell
   npm run dev
   ```

---

## Verify Database Connection

### Test Connection with psql

```powershell
psql -U postgres -d asl_db
```

If successful, you'll see the PostgreSQL prompt. Type `\q` to exit.

### Test Connection from Backend

The backend will automatically test the connection when you run `npm run dev`. If there are connection errors, check:

1. PostgreSQL service is running
2. `DATABASE_URL` in `backend/.env` is correct
3. Database `asl_db` exists
4. Credentials match your PostgreSQL installation

---

## Troubleshooting

### Connection Refused

- Make sure PostgreSQL service is running
- Check if port 5432 is available: `netstat -an | findstr 5432` (Windows) or `lsof -i :5432` (Linux/Mac)
- Verify firewall isn't blocking the connection

### Authentication Failed

- Check username and password in `DATABASE_URL`
- Verify PostgreSQL user exists: `psql -U postgres -c "\du"`
- Reset password if needed: `psql -U postgres -c "ALTER USER postgres PASSWORD 'newpassword';"`

### Database Does Not Exist

Create it manually:
```powershell
psql -U postgres
CREATE DATABASE asl_db;
\q
```

### Docker Container Issues

**View logs:**
```powershell
docker logs asl-postgres
```

**Restart container:**
```powershell
docker restart asl-postgres
```

---

## Default Configuration

The application expects:
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `asl_db`
- **Username**: `postgres`
- **Password**: `postgres`

If your setup differs, update `backend/.env` accordingly.
