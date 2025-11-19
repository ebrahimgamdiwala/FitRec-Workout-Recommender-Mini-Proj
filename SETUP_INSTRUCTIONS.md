# 🚀 FitRec Setup Instructions

> **Note**: This file contains the same setup instructions as SETUP.md. For the most comprehensive guide, see SETUP.md.

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or pnpm

### Backend Setup (5 minutes)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Verify installation (important for JWT):
   ```bash
   python verify_setup.py
   ```

4. Generate sample data or download full dataset:
   ```bash
   python generate_sample_data.py
   ```

5. Initialize the system:
   ```bash
   python init_models.py
   ```

6. Start the Flask server:
   ```bash
   python app.py
   ```

   ✅ Backend running on `http://localhost:5000`

### Frontend Setup (3 minutes)

1. Navigate to frontend directory (in a new terminal):
   ```bash
   cd frontend/workout-recommender
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   ✅ Frontend running on `http://localhost:3000`

## Using the Application

### 1. Create an Account
- Open `http://localhost:3000`
- Click "Login" → "Sign up"
- Enter name, email, password
- You'll be automatically logged in

### 2. Get Recommendations
- Fill in your fitness preferences:
  - Level (Beginner/Intermediate/Advanced)
  - Goal (Muscle/Strength/Endurance/etc.)
  - Equipment (Gym/Home/Bodyweight)
  - Optional: Max program length and workout time
- Click "Generate My Workout Plan"
- Browse top 10 AI-recommended programs
- Click "Save Plan" on programs you like

### 3. Track Your Progress
- Go to Dashboard
- View your saved plans
- Click on a plan to see details
- Log workout sessions with:
  - Date, duration, calories
  - Individual exercises (sets, reps, weight)
- View comprehensive statistics:
  - Total workouts, minutes, calories
  - Current streak
  - Activity charts and patterns
  - Most active days

## Key Features

### ✅ User Authentication & Security
- JWT-based authentication with 24-hour token expiration
- Secure password hashing with bcrypt (12 rounds)
- Protected API routes
- Login/Signup pages with validation

### ✅ AI-Powered Recommendations
- **Hybrid ML System**: Combines metadata clustering + text embeddings
- **KMeans Clustering**: Groups similar workout programs
- **Sentence Embeddings**: Semantic understanding using transformers
- **Cosine Similarity**: Ranks programs by relevance
- Personalized based on:
  - Fitness level (beginner/intermediate/advanced)
  - Goals (muscle, strength, endurance, flexibility, etc.)
  - Equipment availability (gym, home, bodyweight, minimal)
  - Time constraints (max workout duration)
  - Program length preferences (max weeks)

### ✅ Workout Plan Management
- Save unlimited workout plans to your account
- View all saved plans in dashboard
- Track current week/day progress
- Mark plans as completed
- View full exercise details for each plan

### ✅ Comprehensive Progress Tracking
- Log daily workout sessions with:
  - Date, week, and day number
  - Duration in minutes
  - Calories burned
  - Personal notes
- Track individual exercises:
  - Sets completed
  - Reps completed
  - Weight used
  - Exercise-specific notes
- View complete workout history

### ✅ Interactive Dashboard
- **Statistics Overview**:
  - Total workouts, minutes, calories
  - Average workout duration
  - Current workout streak (consecutive days)
- **Data Visualizations**:
  - Line chart: Recent activity trends
  - Pie chart: Most active days of the week
  - Donut chart: Workout categories breakdown
- **Period Selection**: View stats for 7, 30, or 90 days
- **Recent History**: Last 7 workouts with details

## API Endpoints Summary

### Public Endpoints
- `GET /health` - Health check
- `GET /api/options` - Get available options (goals, levels, equipment)
- `POST /api/recommend` - Get AI recommendations
- `GET /api/plan/<title>` - Get plan details

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Workout Management (Protected)
- `POST /api/plans/save` - Save workout plan
- `GET /api/plans` - Get user's saved plans
- `GET /api/plans/<id>/progress` - Get detailed plan progress
- `POST /api/plans/<id>/complete` - Mark plan as completed
- `POST /api/sessions/log` - Log workout session with exercises
- `GET /api/dashboard/stats?days=30` - Get comprehensive statistics

For detailed API documentation, see `backend/README.md`

## Common Issues & Solutions

### Backend Issues

**"module 'jwt' has no attribute 'encode'"**
```bash
pip uninstall jwt
pip install PyJWT==2.9.0
python verify_setup.py
```

**"Recommender not initialized"**
```bash
python init_models.py
```

**"Database not initialized"**
- Database is created automatically on first run
- If issues persist: delete `backend/models/workout_tracker.db` and restart

**"Port 5000 already in use"**
- Change port in `app.py`: `app.run(port=5001)`
- Or stop the conflicting application

### Frontend Issues

**"Failed to connect to server"**
- Ensure backend is running on port 5000
- Check browser console for detailed errors
- Verify CORS is enabled in Flask

**"Token expired"**
- Tokens expire after 24 hours
- Log in again to get a new token

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Data Issues

**"No recommendations found"**
- Try different filter combinations
- Remove max_length and max_time constraints
- Check available options: `http://localhost:5000/api/options`

**"Charts not displaying"**
- Log at least 2 workout sessions
- Check browser console for errors
- Verify Recharts is installed

## Technology Stack

### Backend
- **Flask** 3.1.0 - Web framework
- **PyJWT** 2.9.0 - Authentication
- **bcrypt** 4.2.1 - Password hashing
- **SQLite3** - Database
- **scikit-learn** 1.7.2 - ML clustering
- **sentence-transformers** 5.1.2 - Text embeddings
- **PyTorch** 2.9.0 - Deep learning backend
- **pandas** 2.3.3 - Data processing
- **numpy** 2.3.4 - Numerical computing

### Frontend
- **Next.js** 16.0 - React framework
- **React** 19.2 - UI library
- **Tailwind CSS** 4.0 - Styling
- **Recharts** 3.4 - Data visualization
- **Three.js** 0.180 - 3D graphics
- **Lucide React** - Icons

### Database Schema
- **users** - User accounts (email, password_hash, name)
- **saved_plans** - User's workout plans (plan_data, progress)
- **workout_sessions** - Logged sessions (date, duration, calories)
- **exercise_progress** - Exercise tracking (sets, reps, weight)

Database file: `backend/models/workout_tracker.db`

## Security Best Practices

- ✅ Passwords hashed with bcrypt (12 rounds)
- ✅ JWT tokens with 24-hour expiration
- ✅ Protected API routes with token verification
- ✅ Parameterized SQL queries (no injection)
- ✅ CORS enabled for localhost (configure for production)
- ⚠️ Change `JWT_SECRET_KEY` in production
- ⚠️ Use environment variables for secrets
- ⚠️ Enable HTTPS in production

## Additional Resources

- **Main Documentation**: `README.md`
- **System Architecture**: `ARCHITECTURE.md`
- **Backend API Docs**: `backend/README.md`
- **Dataset Info**: `datasets/data_description.md`
- **Jupyter Notebook**: `notebooks/personalized-workout-program-recommender.ipynb`
- **Full Dataset**: [Kaggle](https://www.kaggle.com/datasets/adnanelouardi/600k-fitness-exercise-and-workout-program-dataset)

## Future Enhancements

Potential features to add:
- Email verification for new accounts
- Password reset functionality
- Social login (Google, Facebook)
- Export workout data to PDF
- Exercise video demonstrations
- Workout reminders and notifications
- Social features (share workouts, follow friends)
- Mobile app (React Native)
- Nutrition tracking integration
- Personal trainer matching

---

**Happy Training! 💪**

For detailed setup instructions, see `SETUP.md`
