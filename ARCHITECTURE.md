# 🏗️ FitRec System Architecture

## System Overview

FitRec is a full-stack AI-powered workout recommendation system with user authentication, progress tracking, and comprehensive analytics. The system uses a hybrid machine learning approach combining metadata clustering and text embeddings for intelligent workout recommendations.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                      (Browser: localhost:3000)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js 16 Frontend (React 19)                          │  │
│  │  • Home Page (Recommendations)                           │  │
│  │  • Login/Signup Pages                                    │  │
│  │  • Dashboard (Statistics & Charts)                       │  │
│  │  • Plan Details Pages                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS + JWT Authentication
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API LAYER                           │
│                    (Flask 3.1 - Port 5000)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  app.py - REST API Endpoints                            │  │
│  │  ├── Public Routes                                       │  │
│  │  │   ├── /health                                         │  │
│  │  │   ├── /api/options                                    │  │
│  │  │   ├── /api/recommend                                  │  │
│  │  │   └── /api/plan/<title>                               │  │
│  │  ├── Authentication Routes                               │  │
│  │  │   ├── /api/auth/register                              │  │
│  │  │   ├── /api/auth/login                                 │  │
│  │  │   └── /api/auth/me (protected)                        │  │
│  │  └── Protected Routes (JWT Required)                     │  │
│  │      ├── /api/plans/save                                 │  │
│  │      ├── /api/plans                                      │  │
│  │      ├── /api/plans/<id>/progress                        │  │
│  │      ├── /api/plans/<id>/complete                        │  │
│  │      ├── /api/sessions/log                               │  │
│  │      └── /api/dashboard/stats                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Python Function Calls
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Auth Manager │   │  Workout     │   │   ML Engine  │
│  (JWT Auth)  │   │  Tracker     │   │ (Recommender)│
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PERSISTENCE LAYER                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  SQLite Database │  │  Pickle Models   │  │  NumPy Arrays│  │
│  │  • users         │  │  • kmeans_model  │  │  • embeddings│  │
│  │  • saved_plans   │  │  • ohe_encoder   │  │  • similarity│  │
│  │  • sessions      │  │  • tfidf_vec     │  │              │  │
│  │  • exercises     │  │                  │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA SOURCES                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  programs_detailed_boostcamp_kaggle.csv                  │  │
│  │  • 12,036 exercise entries                               │  │
│  │  • Fields: title, goal, level, equipment, week, day,     │  │
│  │           exercise_name, sets, reps, intensity           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  program_summary.csv                                     │  │
│  │  • 100 unique programs                                   │  │
│  │  • Fields: title, description, goal, level, equipment,   │  │
│  │           program_length, time_per_workout               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Layer (Next.js 16 + React 19)

```
frontend/workout-recommender/
├── app/
│   ├── page.js                    # Home page with recommendations
│   ├── layout.js                  # Root layout with navigation
│   ├── globals.css                # Global styles
│   ├── dashboard/
│   │   └── page.js                # User dashboard with stats & charts
│   ├── login/
│   │   └── page.js                # Login form
│   ├── signup/
│   │   └── page.js                # Registration form
│   └── plan/[id]/
│       └── page.js                # Individual plan details & tracking
├── components/
│   ├── RecommendSection.jsx       # Main recommendation UI
│   ├── Charts.jsx                 # Recharts visualizations
│   ├── DashboardNavbar.jsx        # Dashboard navigation
│   ├── Navbar.jsx                 # Main navigation
│   ├── Ballpit.jsx                # Three.js 3D background
│   ├── HeroSection.jsx            # Landing hero
│   ├── FeaturesSection.jsx        # Feature showcase
│   ├── Footer.jsx                 # Footer component
│   └── GlassCard.jsx              # Reusable card component
└── lib/
    └── utils.js                   # Utility functions
```

### Backend Layer (Flask 3.1)

```
backend/
├── app.py                         # Main Flask application
│   ├── initialize_app()           # Initialize all components
│   ├── Public endpoints           # /health, /api/options, /api/recommend
│   ├── Auth endpoints             # /api/auth/*
│   ├── Plan management            # /api/plans/*
│   ├── Session tracking           # /api/sessions/*
│   └── Dashboard stats            # /api/dashboard/*
├── utils/
│   ├── recommender.py             # ML recommendation engine
│   │   ├── WorkoutRecommender     # Main class
│   │   ├── _load_data()           # Load & preprocess datasets
│   │   ├── _create_models()       # Train KMeans & encoder
│   │   ├── _load_or_create_text_embeddings()  # Generate embeddings
│   │   ├── top_k_recommendations() # Hybrid recommendation
│   │   ├── get_similar_plans()    # Similarity-based discovery
│   │   └── get_plan_by_title()    # Fetch plan details
│   ├── auth.py                    # Authentication manager
│   │   ├── AuthManager            # JWT & bcrypt handling
│   │   ├── hash_password()        # Bcrypt hashing
│   │   ├── verify_password()      # Password verification
│   │   ├── generate_token()       # JWT creation
│   │   ├── verify_token()         # JWT validation
│   │   └── token_required         # Decorator for protected routes
│   ├── workout_tracker.py         # Progress tracking
│   │   ├── WorkoutTracker         # Main tracking class
│   │   ├── save_plan()            # Save user plans
│   │   ├── log_workout_session()  # Log sessions
│   │   ├── log_exercise_progress() # Log exercises
│   │   ├── get_user_statistics()  # Calculate stats
│   │   └── get_plan_progress()    # Get plan details
│   └── tracker.py                 # Legacy JSON-based tracking
├── models/
│   ├── database.py                # SQLite database handler
│   │   ├── Database               # Main class
│   │   ├── init_database()        # Create tables
│   │   └── get_connection()       # Get DB connection
│   ├── workout_tracker.db         # SQLite database file
│   ├── kmeans_model.pkl           # Trained KMeans model
│   ├── ohe_encoder.pkl            # One-hot encoder
│   ├── program_embeddings.npy     # Text embeddings (384-dim)
│   ├── similarity_matrix.npy      # Cosine similarity matrix
│   ├── embedding_meta.json        # Embedding metadata
│   └── tfidf_vectorizer.joblib    # TF-IDF fallback (optional)
├── init_models.py                 # Model initialization script
├── generate_sample_data.py        # Sample data generator
├── verify_setup.py                # Dependency verification
└── requirements.txt               # Python dependencies
```

## Data Flow Diagrams

### 1. User Registration & Login Flow

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ 1. Enter email, password, name
     ▼
┌─────────────────────────┐
│  Frontend (Signup)      │
└────┬────────────────────┘
     │ 2. POST /api/auth/register
     ▼
┌─────────────────────────┐
│  Flask API              │
│  /api/auth/register     │
└────┬────────────────────┘
     │ 3. Validate input
     ▼
┌─────────────────────────┐
│  AuthManager            │
│  • Check if email exists│
│  • Hash password (bcrypt)│
│  • Insert into DB       │
│  • Generate JWT token   │
└────┬────────────────────┘
     │ 4. Return user data + token
     ▼
┌─────────────────────────┐
│  Frontend               │
│  • Store token in       │
│    localStorage         │
│  • Store user data      │
│  • Redirect to home     │
└─────────────────────────┘
```

### 2. Workout Recommendation Flow (Hybrid ML)

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ 1. Select preferences
     ▼
┌─────────────────────────┐
│   Frontend Form         │
│  • Goal: muscle         │
│  • Level: intermediate  │
│  • Equipment: gym       │
│  • Max Length: 12 weeks │
│  • Max Time: 60 min     │
└────┬────────────────────┘
     │ 2. POST /api/recommend
     ▼
┌─────────────────────────┐
│  Flask API Endpoint     │
│  /api/recommend         │
└────┬────────────────────┘
     │ 3. Extract & validate
     ▼
┌─────────────────────────────────────────┐
│  WorkoutRecommender                     │
│  ┌──────────────────────────────────┐  │
│  │ Step 1: Metadata Clustering      │  │
│  │ • One-hot encode user input      │  │
│  │ • Predict cluster (KMeans)       │  │
│  │ • Filter by cluster              │  │
│  └────┬─────────────────────────────┘  │
│       │                                 │
│  ┌────▼─────────────────────────────┐  │
│  │ Step 2: Apply Filters            │  │
│  │ • Filter by max_length           │  │
│  │ • Filter by max_time             │  │
│  └────┬─────────────────────────────┘  │
│       │                                 │
│  ┌────▼─────────────────────────────┐  │
│  │ Step 3: Text Similarity          │  │
│  │ • Create user text embedding     │  │
│  │ • Compute cosine similarity      │  │
│  │ • Sort by similarity score       │  │
│  └────┬─────────────────────────────┘  │
│       │                                 │
│  ┌────▼─────────────────────────────┐  │
│  │ Step 4: Get Top-K Programs       │  │
│  │ • Select top 10 programs         │  │
│  │ • Fetch exercise details         │  │
│  │ • Format response                │  │
│  └────┬─────────────────────────────┘  │
└───────┼─────────────────────────────────┘
        │ 5. JSON response
        ▼
┌─────────────────────────┐
│  Frontend Display       │
│  • Show recommendations │
│  • Allow saving plans   │
└─────────────────────────┘
```

### 3. Workout Session Logging Flow

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ 1. Complete workout
     ▼
┌─────────────────────────┐
│  Frontend (Plan Page)   │
│  • Enter duration       │
│  • Enter calories       │
│  • Log exercises        │
└────┬────────────────────┘
     │ 2. POST /api/sessions/log
     │    Authorization: Bearer <token>
     ▼
┌─────────────────────────┐
│  Flask API              │
│  @token_required        │
└────┬────────────────────┘
     │ 3. Verify JWT token
     ▼
┌─────────────────────────┐
│  WorkoutTracker         │
│  • Insert session       │
│  • Insert exercises     │
│  • Update plan progress │
└────┬────────────────────┘
     │ 4. Update database
     ▼
┌─────────────────────────┐
│  SQLite Database        │
│  • workout_sessions     │
│  • exercise_progress    │
│  • saved_plans          │
└────┬────────────────────┘
     │ 5. Return session_id
     ▼
┌─────────────────────────┐
│  Frontend               │
│  • Show success message │
│  • Update UI            │
└─────────────────────────┘
```

### 4. Dashboard Statistics Flow

```
┌──────────┐
│   USER   │
└────┬─────┘
     │ 1. Visit dashboard
     ▼
┌─────────────────────────┐
│  Frontend (Dashboard)   │
│  • Select period (7/30/90 days)
└────┬────────────────────┘
     │ 2. GET /api/dashboard/stats?days=30
     │    Authorization: Bearer <token>
     ▼
┌─────────────────────────┐
│  Flask API              │
│  @token_required        │
└────┬────────────────────┘
     │ 3. Verify JWT
     ▼
┌─────────────────────────────────────────┐
│  WorkoutTracker.get_user_statistics()   │
│  ┌──────────────────────────────────┐  │
│  │ Calculate Aggregates             │  │
│  │ • Total workouts                 │  │
│  │ • Total minutes                  │  │
│  │ • Total calories                 │  │
│  │ • Average duration               │  │
│  └────┬─────────────────────────────┘  │
│       │                                 │
│  ┌────▼─────────────────────────────┐  │
│  │ Analyze Patterns                 │  │
│  │ • Workouts by day of week        │  │
│  │ • Most active day                │  │
│  │ • Workout categories             │  │
│  └────┬─────────────────────────────┘  │
│       │                                 │
│  ┌────▼─────────────────────────────┐  │
│  │ Calculate Streak                 │  │
│  │ • Get recent workout dates       │  │
│  │ • Count consecutive days         │  │
│  └────┬─────────────────────────────┘  │
│       │                                 │
│  ┌────▼─────────────────────────────┐  │
│  │ Get Recent History               │  │
│  │ • Last 7 workouts                │  │
│  │ • Date, duration, calories       │  │
│  └────┬─────────────────────────────┘  │
└───────┼─────────────────────────────────┘
        │ 4. Return statistics JSON
        ▼
┌─────────────────────────┐
│  Frontend Dashboard     │
│  • Render stat cards    │
│  • Draw charts (Recharts)│
│  • Show recent activity │
└─────────────────────────┘
```

## Machine Learning Architecture

### Hybrid Recommendation System

```
┌─────────────────────────────────────────────────────────────┐
│                    TRAINING PHASE (Offline)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Data Loading & Preprocessing                            │
│     ├── Load CSV files (12K+ exercises, 100 programs)       │
│     ├── Clean metadata (goal, level, equipment)             │
│     ├── Merge with program summaries                        │
│     └── Create text input (title + description + exercises) │
│                                                              │
│  2. Metadata Clustering                                     │
│     ├── One-Hot Encode: goal, level, equipment              │
│     ├── Train KMeans (n_clusters = goal × level × 2)        │
│     ├── Assign cluster labels to programs                   │
│     └── Save: kmeans_model.pkl, ohe_encoder.pkl             │
│                                                              │
│  3. Text Embeddings                                         │
│     ├── Use SentenceTransformer ('all-MiniLM-L6-v2')        │
│     │   OR fallback to TF-IDF if unavailable                │
│     ├── Generate embeddings for all programs (384-dim)      │
│     └── Save: program_embeddings.npy                        │
│                                                              │
│  4. Similarity Matrix                                       │
│     ├── Compute cosine_similarity(embeddings, embeddings)   │
│     ├── Create NxN matrix (N = number of programs)          │
│     └── Save: similarity_matrix.npy                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   INFERENCE PHASE (Online)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Input: {goal, level, equipment, max_length, max_time} │
│                                                              │
│  Step 1: Metadata Filtering                                 │
│     ├── One-hot encode user input                           │
│     ├── Predict cluster using KMeans                        │
│     ├── Filter programs in predicted cluster                │
│     ├── Apply max_length filter                             │
│     └── Apply max_time filter                               │
│                                                              │
│  Step 2: Semantic Ranking                                   │
│     ├── Create user query text: "goal level equipment"      │
│     ├── Generate query embedding                            │
│     ├── Compute cosine similarity with candidate embeddings │
│     └── Sort candidates by similarity score                 │
│                                                              │
│  Step 3: Top-K Selection                                    │
│     ├── Select top 10 programs                              │
│     ├── Fetch exercise details from detailed CSV            │
│     └── Format response with metadata + exercises           │
│                                                              │
│  Output: List of recommended programs with similarity scores│
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### SQLite Database (workout_tracker.db)

```sql
-- Users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Saved workout plans
CREATE TABLE saved_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_title TEXT NOT NULL,
    plan_data TEXT NOT NULL,              -- JSON string
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT 0,
    current_week INTEGER DEFAULT 1,
    current_day INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, plan_title)
);

-- Daily workout sessions
CREATE TABLE workout_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan_id INTEGER NOT NULL,
    session_date DATE NOT NULL,
    week_number INTEGER,
    day_number INTEGER,
    duration_minutes INTEGER,
    calories_burned INTEGER,
    notes TEXT,
    completed BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (plan_id) REFERENCES saved_plans(id)
);

-- Exercise completion tracking
CREATE TABLE exercise_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    exercise_name TEXT NOT NULL,
    sets_completed INTEGER,
    reps_completed TEXT,
    weight_used REAL,
    completed BOOLEAN DEFAULT 1,
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES workout_sessions(id)
);
```

## API Contract

### Request/Response Formats

#### Authentication

```typescript
// Register Request
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Login Request
interface LoginRequest {
  email: string;
  password: string;
}

// Auth Response
interface AuthResponse {
  success: boolean;
  user: {
    user_id: number;
    email: string;
    name: string;
    token: string;
  };
  error?: string;
}
```

#### Recommendations

```typescript
// Recommend Request
interface RecommendRequest {
  goal: string;                    // "muscle" | "strength" | "endurance" | ...
  level: string;                   // "beginner" | "intermediate" | "advanced"
  equipment: string;               // "gym" | "home" | "bodyweight" | ...
  max_length?: number;             // Max program length in weeks
  max_time?: number;               // Max time per workout in minutes
  num_recommendations?: number;    // Default: 10
}

// Recommend Response
interface RecommendResponse {
  success: boolean;
  recommendations: WorkoutProgram[];
  error?: string;
}

interface WorkoutProgram {
  title: string;
  description: string;
  goal: string;
  level: string;
  equipment: string;
  program_length: number;          // in weeks
  time_per_workout: number;        // in minutes
  total_exercises: number;
  exercises: Exercise[];           // First 10 exercises
}

interface Exercise {
  name: string;
  week: number;
  day: number;
  sets: string;
  reps: string;
  intensity: string;
}
```

#### Workout Tracking

```typescript
// Log Session Request
interface LogSessionRequest {
  plan_id: number;
  session_date: string;            // "YYYY-MM-DD"
  week_number: number;
  day_number: number;
  duration_minutes: number;
  calories_burned: number;
  notes?: string;
  exercises: ExerciseLog[];
}

interface ExerciseLog {
  exercise_name: string;
  sets_completed: number;
  reps_completed: string;
  weight_used?: number;
  notes?: string;
}

// Dashboard Stats Response
interface DashboardStatsResponse {
  success: boolean;
  stats: {
    total_workouts: number;
    total_minutes: number;
    total_calories: number;
    avg_duration: number;
    workouts_by_day: Record<string, number>;
    most_active_day: string;
    categories: Record<string, number>;
    recent_workouts: RecentWorkout[];
    current_streak: number;
    period_days: number;
  };
}

interface RecentWorkout {
  session_date: string;
  duration_minutes: number;
  calories_burned: number;
}
```

## Security Architecture

### Authentication Flow

```
1. User Registration
   ├── Password hashing with bcrypt (12 rounds)
   ├── Store hashed password in database
   └── Generate JWT token with 24-hour expiration

2. User Login
   ├── Verify email exists
   ├── Compare password with bcrypt.checkpw()
   ├── Generate new JWT token
   └── Return token to client

3. Protected Routes
   ├── Extract token from Authorization header
   ├── Verify token signature and expiration
   ├── Decode user_id from token payload
   └── Attach user_id to request object

4. Token Storage (Client)
   ├── Store token in localStorage
   ├── Include in Authorization header: "Bearer <token>"
   └── Clear on logout or expiration
```

### Security Best Practices

- **Password Hashing**: bcrypt with salt rounds = 12
- **JWT Secret**: Environment variable (change in production)
- **Token Expiration**: 24 hours
- **CORS**: Enabled for localhost:3000 (configure for production)
- **SQL Injection**: Parameterized queries with sqlite3
- **Input Validation**: Server-side validation for all inputs

## Technology Stack Details

### Frontend Dependencies

```json
{
  "next": "16.0.0",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "tailwindcss": "^4",
  "recharts": "^3.4.1",
  "three": "^0.180.0",
  "lucide-react": "^0.548.0",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1"
}
```

### Backend Dependencies

```
Flask==3.1.0
flask-cors==5.0.0
PyJWT==2.9.0
bcrypt==4.2.1
pandas==2.3.3
numpy==2.3.4
scikit-learn==1.7.2
sentence-transformers==5.1.2
torch==2.9.0
joblib==1.5.2
```

## Performance Considerations

### ML Model Performance

- **Model Loading**: ~2-3 seconds on first startup
- **Embedding Generation**: ~5-10 seconds for 100 programs
- **Recommendation Query**: ~50-100ms per request
- **Similarity Lookup**: O(1) with precomputed matrix

### Database Performance

- **SQLite**: Suitable for <10K users
- **Indexes**: Created on user_id, plan_id, session_date
- **Query Optimization**: Use of prepared statements
- **Connection Pooling**: Single connection per request

### Caching Strategy

- **Model Caching**: Models loaded once at startup
- **Embedding Caching**: Precomputed and saved to disk
- **Similarity Matrix**: Precomputed NxN matrix
- **Frontend Caching**: localStorage for user data and token

## Deployment Architecture

### Development Environment

```
Frontend: localhost:3000 (Next.js dev server)
Backend:  localhost:5000 (Flask debug mode)
Database: SQLite file (backend/models/workout_tracker.db)
```

### Production Recommendations

```
Frontend: Vercel / Netlify (Static export)
Backend:  Gunicorn + Nginx (4 workers)
Database: PostgreSQL (migrate from SQLite)
Cache:    Redis (for session management)
CDN:      CloudFront / Cloudflare (static assets)
```

---

**Architecture Version**: 2.0  
**Last Updated**: November 19, 2024  
**Status**: Production-ready with authentication and tracking
