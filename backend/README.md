# FitRec Backend API

This is the backend API for the FitRec Workout Recommender system. It uses machine learning to recommend personalized workout programs based on user preferences, with full user authentication and progress tracking capabilities.

## Features

- **Hybrid ML Recommendations**: Combines KMeans clustering with sentence embeddings for intelligent recommendations
- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Workout Tracking**: Comprehensive progress tracking with SQLite database
- **Dashboard Statistics**: Real-time analytics on workouts, calories, streaks, and patterns
- **RESTful API**: Built with Flask 3.1 with CORS support
- **Protected Routes**: Token-based authentication for user-specific endpoints
- **Flexible Filtering**: Filter by goal, level, equipment, duration, and time

## Setup Instructions

### 1. Install Dependencies

Make sure you have Python 3.8+ installed, then install the required packages:

```bash
cd backend
pip install -r requirements.txt
```

### 2. Verify Dataset Files

Ensure the following files exist in the `datasets/` folder:
- `programs_detailed_boostcamp_kaggle.csv`
- `program_summary.csv`

If you don't have the dataset, generate sample data:
```bash
python generate_sample_data.py
```

### 3. Initialize the System

Run the initialization script to preprocess data, create ML models, and set up the database:

```bash
python init_models.py
```

This will:
- Load and preprocess the workout data
- Create KMeans clustering models
- Generate text embeddings using SentenceTransformers
- Compute similarity matrix for program recommendations
- Initialize SQLite database with user tables
- Save trained models to the `models/` directory
- Verify the system is working correctly

### 4. Start the Server

Run the Flask development server:

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Public Endpoints

#### Health Check
```
GET /health
```
Returns server status and whether the recommender is loaded.

#### Get Available Options
```
GET /api/options
```
Returns all available options for goals, levels, and equipment.

#### Get Recommendations
```
POST /api/recommend
```
Get personalized workout recommendations using hybrid ML approach.

**Request Body:**
```json
{
  "goal": "muscle",
  "level": "intermediate",
  "equipment": "gym",
  "max_length": 12,
  "max_time": 60,
  "num_recommendations": 10
}
```

#### Get Plan Details
```
GET /api/plan/<plan_title>
```
Get full details of a specific plan including all exercises.

### Authentication Endpoints

#### Register
```
POST /api/auth/register
```
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "user_id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### Login
```
POST /api/auth/login
```
Login and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```
Get current user information (protected route).

### Workout Management Endpoints (Protected)

All endpoints below require JWT authentication via `Authorization: Bearer <token>` header.

#### Save Workout Plan
```
POST /api/plans/save
```
Save a workout plan to user's account.

**Request Body:**
```json
{
  "plan_title": "Program 1: Muscle Training",
  "plan_data": {
    "title": "Program 1: Muscle Training",
    "goal": "muscle",
    "level": "intermediate",
    "equipment": "gym",
    "program_length": 12,
    "time_per_workout": 60
  }
}
```

#### Get User Plans
```
GET /api/plans
```
Get all saved plans for the authenticated user.

#### Get Plan Progress
```
GET /api/plans/<plan_id>/progress
```
Get detailed progress for a specific plan including all logged sessions.

#### Complete Plan
```
POST /api/plans/<plan_id>/complete
```
Mark a plan as completed.

#### Log Workout Session
```
POST /api/sessions/log
```
Log a completed workout session with exercises.

**Request Body:**
```json
{
  "plan_id": 1,
  "session_date": "2024-11-19",
  "week_number": 1,
  "day_number": 1,
  "duration_minutes": 60,
  "calories_burned": 400,
  "notes": "Great workout!",
  "exercises": [
    {
      "exercise_name": "Bench Press",
      "sets_completed": 4,
      "reps_completed": "10",
      "weight_used": 185,
      "notes": "Felt strong"
    }
  ]
}
```

#### Get Dashboard Statistics
```
GET /api/dashboard/stats?days=30
```
Get comprehensive workout statistics for the specified period.

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_workouts": 15,
    "total_minutes": 900,
    "total_calories": 6000,
    "avg_duration": 60,
    "workouts_by_day": {
      "Monday": 5,
      "Wednesday": 4,
      "Friday": 6
    },
    "most_active_day": "Friday",
    "categories": {
      "Muscle": 10,
      "Strength": 5
    },
    "recent_workouts": [...],
    "current_streak": 3,
    "period_days": 30
  }
}
```

## Project Structure

```
backend/
├── app.py                         # Main Flask application with all endpoints
├── init_models.py                 # Model initialization script
├── generate_sample_data.py        # Sample data generator
├── verify_setup.py                # Dependency verification script
├── requirements.txt               # Python dependencies
├── models/                        # Trained ML models & database
│   ├── database.py                # SQLite database handler
│   ├── workout_tracker.db         # User data database
│   ├── kmeans_model.pkl           # Trained KMeans clustering model
│   ├── ohe_encoder.pkl            # One-hot encoder for metadata
│   ├── program_embeddings.npy     # Text embeddings (384-dim)
│   ├── similarity_matrix.npy      # Precomputed cosine similarities
│   ├── embedding_meta.json        # Embedding metadata
│   └── tfidf_vectorizer.joblib    # TF-IDF fallback (optional)
└── utils/
    ├── __init__.py
    ├── recommender.py             # ML recommendation engine
    ├── auth.py                    # JWT authentication manager
    ├── workout_tracker.py         # Progress tracking logic
    └── tracker.py                 # Legacy JSON-based tracking
```

## How It Works

### Hybrid Recommendation System

1. **Data Loading**: Loads workout data from CSV files (12K+ exercises, 100 programs)
2. **Preprocessing**: Cleans and normalizes goal, level, and equipment metadata
3. **Metadata Clustering**: Uses KMeans to group similar workout programs
4. **Text Embeddings**: Generates semantic embeddings using SentenceTransformers
5. **Hybrid Recommendation**:
   - Step 1: Use metadata clustering to narrow candidates
   - Step 2: Apply filters (length, time)
   - Step 3: Rank by semantic similarity to user query
   - Step 4: Return top-k programs

### Authentication System

1. **Registration**: Hash password with bcrypt, store in database, generate JWT
2. **Login**: Verify credentials, generate new JWT token
3. **Protected Routes**: Verify JWT token, extract user_id, authorize access

### Progress Tracking

1. **Save Plans**: Store workout plans with user association
2. **Log Sessions**: Record workout sessions with date, duration, calories
3. **Track Exercises**: Log individual exercise completion with sets, reps, weight
4. **Calculate Statistics**: Aggregate data for dashboard analytics

## Environment Variables

- `PORT`: Server port (default: 5000)
- `JWT_SECRET_KEY`: Secret key for JWT token signing (change in production!)
- `JWT_EXPIRATION_HOURS`: Token expiration time (default: 24)

## Development

To run in debug mode (auto-reload on code changes):
```bash
python app.py
```

## Troubleshooting

**Error: "Recommender not initialized"**
- Make sure you ran `python init_models.py` before starting the server
- Check that dataset files exist in the `datasets/` folder

**Error: "Module 'jwt' has no attribute 'encode'"**
- Uninstall conflicting jwt packages: `pip uninstall jwt`
- Reinstall PyJWT: `pip install PyJWT==2.9.0`
- Run verification: `python verify_setup.py`

**Error: "Database not initialized"**
- The database is created automatically on first run
- Check that `models/workout_tracker.db` exists
- Run `python init_models.py` to reinitialize

**Error: "No recommendations found"**
- Try different filter combinations
- Check available options using `/api/options` endpoint
- Relax constraints like max_length and max_time

**Error: "Token expired"**
- Tokens expire after 24 hours
- User needs to log in again to get a new token

## Security Notes

- Change `JWT_SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens expire after 24 hours
- Use parameterized queries to prevent SQL injection

## Performance

- **Model Loading**: ~2-3 seconds on startup
- **Recommendation Query**: ~50-100ms per request
- **Database Queries**: <10ms for most operations
- **Embedding Generation**: Precomputed and cached

## License

MIT
