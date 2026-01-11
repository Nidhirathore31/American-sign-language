# ASL Teacher Application

An interactive web application that teaches American Sign Language (ASL) using computer vision and real-time feedback. The application uses the user's camera to detect hand gestures, provide instructional guidance, evaluate performance, and track learning progress.

## Features

### Core Features

- ✅ **Camera Integration**: Access user's webcam for real-time hand gesture detection
- ✅ **Interactive Learning Module**: Learn ASL signs through visual demonstrations and instructions
- ✅ **Real-Time Gesture Recognition**: Analyze user's hand gestures using MediaPipe Hands
- ✅ **Text-to-Speech Feedback**: Audio instructions and feedback using Web Speech API
- ✅ **Testing & Scoring System**: 10-sign assessments with scoring and feedback
- ✅ **Performance Analytics**: Detailed reports with improvement recommendations
- ✅ **User Authentication**: Registration and login with JWT authentication
- ✅ **PostgreSQL Database**: Store user data and test history
- ✅ **Responsive Design**: Modern UI built with Next.js and Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MediaPipe Hands** - Hand landmark detection
- **Web Speech API** - Text-to-speech

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## Project Structure

```
ASL assessment/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── index.ts        # Server entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── Dockerfile
├── frontend/asl/
│   ├── app/                # Next.js app directory
│   │   ├── page.tsx        # Landing page
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── learn/          # Learning page
│   │   ├── test/           # Test page
│   │   ├── result/         # Results page
│   │   └── history/        # History page
│   ├── components/         # React components
│   ├── utils/              # Utility functions
│   └── data/               # Sign data
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## Prerequisites

- Node.js 20 or higher
- PostgreSQL 15 or higher
- Docker and Docker Compose (optional, for containerized deployment)
- npm or yarn

## Installation

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd "ASL assessment"
```

2. Create environment files:
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your database URL and JWT secret

# Frontend
cd ../frontend/asl
cp .env.example .env.local
# Edit .env.local with your API URL
```

3. Start all services:
```bash
cd ../..
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

### Option 2: Local Development

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

4. Set up database:
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

5. Start the server:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend/asl
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

4. Start the development server:
```bash
npm run dev
```

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

## Usage

1. **Register/Login**: Create an account or login to track your progress
2. **Learn Signs**: Browse available ASL signs, view instructions, and practice with real-time feedback
3. **Take Test**: Complete a 10-sign assessment to evaluate your knowledge
4. **View Results**: See detailed performance reports with recommendations
5. **View History**: Track your progress over time

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tests
- `POST /api/test` - Save test result (requires authentication)
- `GET /api/test/history` - Get user's test history (requires authentication)
- `GET /api/test/:id` - Get specific test result (requires authentication)

## Database Schema

### User
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - Optional user name
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### TestResult
- `id` - Primary key
- `userId` - Foreign key to User
- `score` - Number of correct answers
- `total` - Total number of questions (default: 10)
- `percentage` - Score percentage
- `results` - JSON array of detailed results
- `createdAt` - Test completion timestamp

## Deployment

### Deployment Options

The application can be deployed to various platforms:

#### Backend
- **Render** (free tier with Docker support)
- **Railway** (free tier, excellent Docker support)
- **Fly.io** (free tier, Docker-native)
- **Google Cloud Run** (free tier available)

#### Database
- **Supabase** (free PostgreSQL)
- **Neon** (free serverless PostgreSQL)
- **ElephantSQL** (free tier)
- **Railway PostgreSQL** (included with app deployment)

#### Frontend
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Render**

### Deployment Steps

1. **Set up database**: Create a PostgreSQL database on your preferred provider
2. **Deploy backend**:
   - Set environment variables (DATABASE_URL, JWT_SECRET, PORT)
   - Run database migrations: `npx prisma migrate deploy`
   - Start the server
3. **Deploy frontend**:
   - Set `NEXT_PUBLIC_API_URL` to your backend URL
   - Build and deploy

### Docker Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend/asl
npm test
```

### Database Management
```bash
# Prisma Studio (GUI for database)
cd backend
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy
```

## Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted in the browser
- Check if the device has a camera available
- Try using HTTPS (required for camera access in production)

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall settings

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`
- Ensure Node.js version is 20 or higher

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- MediaPipe Hands for hand landmark detection
- ASL sign data and references
- Web Speech API for text-to-speech functionality

## Support

For issues or questions, please open an issue on the GitHub repository.
