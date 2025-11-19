# 🚀 FitRec Setup Instructions

## Prerequisites
- Python 3.8+
- Node.js 16+
- npm or pnpm

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

**Important:** Make sure PyJWT is installed correctly:
```bash
pip install PyJWT==2.9.0
pip install bcrypt==4.2.1
```

### 3. Initialize the database and models
```bash
python init_models.py
```

This will:
- Create the SQLite database with user tables
- Train ML models if they don't exist
- Set up the workout recommendation system

### 4. Start the Flask backend server
```bash
python app.py
```

The backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to frontend directory (in a new terminal)
```bash
cd frontend/workout-recommender
```

### 2. Install Node dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Testing the Application

### 1. Open your browser
Navigate to `http://localhost:3000`

### 2. Create an account
- Click "Login" in the navbar
- Click "Sign up" 
- Fill in your details (name, email, password)
- You'll be automatically logged in and redirected to the dashboard

### 3. Get workout recommendations
- Go back to home page
- Fill in your fitness preferences
- Click "Generate My Workout Plan"
- Save a plan to your account

### 4. Track your progress
- Go to Dashboard to see your saved plans
- Click on a plan to view details
- Log workout sessions
- View statistics and charts

## Features Implemented

### ✅ User Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Login/Signup pages
- Protected routes

### ✅ Workout Plan Management
- Save workout plans to user account
- View all saved plans
- Track current week/day progress
- Mark plans as completed

### ✅ Progress Tracking
- Log daily workout sessions
- Track duration, calories, and exercises
- View workout history
- Calculate completion rates

### ✅ User Dashboard
- Overall workout statistics
- Total workouts, minutes, calories
- Current workout streak
- Most active days chart
- Workout categories breakdown
- Recent workout history

### ✅ AI-Powered Recommendations
- ML-based workout recommendations
- 600K+ workout dataset
- Personalized based on:
  - Fitness level (beginner/intermediate/advanced)
  - Goals (muscle, strength, endurance, etc.)
  - Equipment availability
  - Time constraints
  - Program length preferences

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Workout Plans
- `POST /api/plans/save` - Save workout plan (protected)
- `GET /api/plans` - Get user's saved plans (protected)
- `GET /api/plans/<id>/progress` - Get plan progress (protected)
- `POST /api/plans/<id>/complete` - Mark plan complete (protected)

### Workout Sessions
- `POST /api/sessions/log` - Log workout session (protected)

### Dashboard
- `GET /api/dashboard/stats?days=30` - Get statistics (protected)

### Recommendations (Public)
- `POST /api/recommend` - Get workout recommendations
- `GET /api/options` - Get available options
- `GET /api/plan/<title>` - Get plan details

## Troubleshooting

### Backend Issues

**"module 'jwt' has no attribute 'encode'"**
- Uninstall any conflicting jwt packages:
  ```bash
  pip uninstall jwt
  pip install PyJWT==2.9.0
  ```

**"Database not initialized"**
- Run: `python init_models.py`

**"Port 5000 already in use"**
- Change port in `app.py` or stop other application

### Frontend Issues

**"Failed to connect to server"**
- Ensure backend is running on port 5000
- Check browser console for CORS errors

**"Module not found"**
- Delete `node_modules` and `package-lock.json`
- Run: `npm install`

## Database Schema

The application uses SQLite with the following tables:

- **users** - User accounts
- **saved_plans** - User's saved workout plans
- **workout_sessions** - Logged workout sessions
- **exercise_progress** - Individual exercise tracking

Database file: `backend/models/workout_tracker.db`

## Security Notes

- Change `JWT_SECRET_KEY` in production
- Use environment variables for sensitive data
- HTTPS recommended for production
- Passwords are hashed with bcrypt (salt rounds: 12)
- JWT tokens expire after 24 hours

## Tech Stack

### Backend
- Flask 3.1.0
- PyJWT 2.9.0
- bcrypt 4.2.1
- SQLite3
- scikit-learn 1.7.2
- sentence-transformers 5.1.2

### Frontend
- Next.js 16.0
- React 19.2
- Tailwind CSS 4
- Lucide React (icons)
- Three.js (3D animations)

## Next Steps

- Add email verification
- Implement password reset
- Add social login (Google, Facebook)
- Export workout data to PDF
- Add exercise video demonstrations
- Implement workout reminders
- Add social features (share workouts)
- Mobile app (React Native)

---

**Happy Training! 💪**
