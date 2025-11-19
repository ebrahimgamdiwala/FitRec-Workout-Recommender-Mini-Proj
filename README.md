# 🏋️ FitRec - AI-Powered Workout Recommender

An intelligent workout recommendation system that uses machine learning to provide personalized fitness programs based on user preferences, with comprehensive user authentication and progress tracking.

## 🌟 Features

### Core Functionality
- **AI-Powered Recommendations**: Hybrid recommendation system combining KMeans clustering and sentence embeddings on 600K+ workout data
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Workout Plan Management**: Save, track, and manage personalized workout plans
- **Progress Tracking**: Log workout sessions, track exercises, and monitor performance
- **Interactive Dashboard**: Comprehensive statistics with charts and visualizations
- **Similar Plan Discovery**: Find related workout programs using cosine similarity

### Technical Features
- **Hybrid ML Approach**: Combines metadata clustering with text embeddings for better recommendations
- **RESTful API**: Flask backend with protected routes and CORS support
- **Modern Frontend**: Next.js 16 with React 19, Tailwind CSS 4, and 3D animations
- **Flexible Filtering**: Filter by goal, level, equipment, program length, and workout duration
- **Real-time Statistics**: Track workouts, calories, streaks, and activity patterns
## 🏗️ Project Structure

```
FitRec-Workout-Recommender-Mini-Proj/
├── frontend/
│   └── workout-recommender/           # Next.js frontend application
│       ├── app/
│       │   ├── page.js                # Home page with recommendations
│       │   ├── dashboard/             # User dashboard with stats
│       │   ├── login/                 # Login page
│       │   ├── signup/                # Registration page
│       │   └── plan/[id]/             # Individual plan details
│       ├── components/
│       │   ├── RecommendSection.jsx   # Main recommendation UI
│       │   ├── Charts.jsx             # Data visualization components
│       │   ├── DashboardNavbar.jsx    # Dashboard navigation
│       │   ├── Ballpit.jsx            # 3D background animation
│       │   └── ...                    # Other UI components
│       └── package.json
├── backend/
│   ├── app.py                         # Flask API server with all endpoints
│   ├── init_models.py                 # Model initialization script
│   ├── generate_sample_data.py        # Sample data generator
│   ├── verify_setup.py                # Dependency verification
│   ├── utils/
│   │   ├── recommender.py             # ML recommendation engine
│   │   ├── auth.py                    # JWT authentication
│   │   ├── workout_tracker.py         # Progress tracking logic
│   │   └── tracker.py                 # Legacy tracking (JSON-based)
│   ├── models/
│   │   ├── database.py                # SQLite database handler
│   │   ├── workout_tracker.db         # User data database
│   │   ├── kmeans_model.pkl           # Trained clustering model
│   │   ├── ohe_encoder.pkl            # One-hot encoder
│   │   ├── program_embeddings.npy     # Text embeddings
│   │   └── similarity_matrix.npy      # Precomputed similarities
│   └── requirements.txt
├── datasets/
│   ├── programs_detailed_boostcamp_kaggle.csv  # 12K+ exercise entries
│   ├── program_summary.csv                     # 100 program summaries
│   └── data_description.md
└── notebooks/
    └── personalized-workout-program-recommender.ipynb
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or pnpm

### 1. Set Up the Backend

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Initialize ML models (first time only)
python init_models.py

# Start the Flask server
python app.py
```

The backend will run on `http://localhost:5000`

### 2. Set Up the Frontend

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend/workout-recommender

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Access the Application

Open your browser and visit `http://localhost:3000`

## 💡 How to Use

### For New Users
1. **Sign Up**: Create an account with email and password
2. **Get Recommendations**: 
   - Select your fitness level (Beginner, Intermediate, Advanced)
   - Choose your goal (Muscle, Strength, Endurance, etc.)
   - Specify equipment (Gym, Home, Bodyweight)
   - Set preferences (program length, time per workout)
   - Click "Generate My Workout Plan"
3. **Save Plans**: Save recommended plans to your account
4. **Track Progress**: Log workout sessions and exercises
5. **View Dashboard**: Monitor statistics, streaks, and activity patterns

### Dashboard Features
- **Statistics Overview**: Total workouts, minutes, calories, and current streak
- **Activity Charts**: Line charts showing recent workout trends
- **Day Analysis**: Pie chart of most active workout days
- **Category Breakdown**: Donut chart of workout types
- **Plan Management**: View and track all saved workout plans

## 🔧 API Documentation

### Base URL
```
http://localhost:5000
```

### Public Endpoints

#### Health Check
```http
GET /health
```

#### Get Available Options
```http
GET /api/options
```

#### Get Recommendations
```http
POST /api/recommend
Content-Type: application/json

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
```http
GET /api/plan/<plan_title>
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Workout Management Endpoints (Protected)

#### Save Workout Plan
```http
POST /api/plans/save
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan_title": "Program 1: Muscle Training",
  "plan_data": { ... }
}
```

#### Get User Plans
```http
GET /api/plans
Authorization: Bearer <token>
```

#### Get Plan Progress
```http
GET /api/plans/<plan_id>/progress
Authorization: Bearer <token>
```

#### Complete Plan
```http
POST /api/plans/<plan_id>/complete
Authorization: Bearer <token>
```

#### Log Workout Session
```http
POST /api/sessions/log
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan_id": 1,
  "session_date": "2024-11-19",
  "week_number": 1,
  "day_number": 1,
  "duration_minutes": 60,
  "calories_burned": 400,
  "notes": "Great workout!",
  "exercises": [...]
}
```

#### Get Dashboard Statistics
```http
GET /api/dashboard/stats?days=30
Authorization: Bearer <token>
```

See [backend/README.md](backend/README.md) for detailed API documentation.

## 🧠 Machine Learning Approach

The recommendation system uses a hybrid approach combining metadata clustering and text embeddings:

### 1. Metadata Clustering
- **One-Hot Encoding**: Categorical features (goal, level, equipment)
- **KMeans Clustering**: Groups similar workout programs into clusters
- **Cluster Prediction**: Finds the best cluster for user preferences

### 2. Text Embeddings
- **Sentence Transformers**: Uses 'all-MiniLM-L6-v2' model for semantic understanding
- **Fallback to TF-IDF**: If transformers unavailable, uses TF-IDF vectorization
- **Text Input**: Combines title, description, and common exercises

### 3. Hybrid Recommendation
- **Step 1**: Use metadata clustering to narrow down candidates
- **Step 2**: Apply filters (program length, workout time)
- **Step 3**: Compute cosine similarity between user query and program embeddings
- **Step 4**: Return top-k programs sorted by similarity score

### 4. Similar Plan Discovery
- **Precomputed Similarity Matrix**: Cosine similarity between all program embeddings
- **Fast Retrieval**: O(1) lookup for similar programs

### Dataset

- **600K+ workout entries** from fitness programs
- **100 unique programs** in sample data (2,598 in full dataset)
- **12K+ exercise entries** with detailed workout information
- Features: goal, level, equipment, duration, exercises, intensity, sets, reps

Source: [Kaggle Fitness Exercise Dataset](https://www.kaggle.com/datasets/adnanelouardi/600k-fitness-exercise-and-workout-program-dataset)

## 🛠️ Technology Stack

### Frontend
- **Next.js** 16.0 - React framework with App Router
- **React** 19.2 - UI library
- **Tailwind CSS** 4.0 - Utility-first CSS framework
- **Recharts** 3.4 - Data visualization library
- **Three.js** 0.180 - 3D graphics for background animations
- **Lucide React** - Icon library

### Backend
- **Flask** 3.1.0 - Web framework
- **Flask-CORS** 5.0.0 - Cross-origin resource sharing
- **PyJWT** 2.9.0 - JSON Web Token authentication
- **bcrypt** 4.2.1 - Password hashing
- **SQLite3** - Database for user data and tracking

### Machine Learning
- **scikit-learn** 1.7.2 - KMeans clustering, preprocessing
- **sentence-transformers** 5.1.2 - Text embeddings
- **PyTorch** 2.9.0 - Deep learning backend
- **pandas** 2.3.3 - Data manipulation
- **numpy** 2.3.4 - Numerical computing
- **joblib** 1.5.2 - Model serialization

## 📊 Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
pytest

# Frontend tests (if implemented)
cd frontend/workout-recommender
npm test
```

### Building for Production

#### Backend
```bash
cd backend
pip install -r requirements.txt
python init_models.py
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Frontend
```bash
cd frontend/workout-recommender
npm run build
npm start
```

## 🐛 Troubleshooting

### Backend Issues

**"Recommender not initialized"**
- Run `python init_models.py` before starting the server
- Ensure dataset files exist in `datasets/` folder

**"Module 'jwt' has no attribute 'encode'"**
- Uninstall conflicting jwt packages: `pip uninstall jwt`
- Reinstall PyJWT: `pip install PyJWT==2.9.0`
- Run verification: `python backend/verify_setup.py`

**"Database not initialized"**
- The database is created automatically on first run
- Check that `backend/models/workout_tracker.db` exists

**"Module not found" errors**
- Install all dependencies: `pip install -r backend/requirements.txt`

### Frontend Issues

**"Failed to connect to server"**
- Make sure the backend is running on port 5000
- Check CORS settings if running on different domains
- Verify token is being sent in Authorization header

**"No recommendations found"**
- Try different filter combinations
- Check available options at `http://localhost:5000/api/options`
- Relax constraints like max_length and max_time

**"Token expired" errors**
- Tokens expire after 24 hours
- Log in again to get a new token

### Data Issues

**"No dataset files found"**
- Run `python backend/generate_sample_data.py` to create sample data
- Or download full dataset from Kaggle and place in `datasets/` folder

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Dataset from Kaggle
- Built with Next.js, Flask, and scikit-learn
- Inspired by modern fitness apps

---

**Happy Training! 💪**
