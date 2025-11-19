# 🚀 FitRec Setup Guide

Complete setup guide for the FitRec AI-Powered Workout Recommender system.

## Prerequisites

- **Python** 3.8 or higher
- **Node.js** 16 or higher
- **npm** or **pnpm**
- **Git** (optional, for cloning)

## Step 1: Backend Setup

### 1.1 Navigate to Backend Directory

```bash
cd backend
```

### 1.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Important**: Verify PyJWT installation:
```bash
python verify_setup.py
```

If you see JWT errors, run:
```bash
pip uninstall jwt
pip install PyJWT==2.9.0 bcrypt==4.2.1
```

### 1.3 Prepare Dataset

**Option A: Generate Sample Data** (Quick start)
```bash
python generate_sample_data.py
```
This creates 100 sample programs with 12K+ exercises.

**Option B: Use Full Dataset** (Recommended for production)
1. Download from [Kaggle](https://www.kaggle.com/datasets/adnanelouardi/600k-fitness-exercise-and-workout-program-dataset)
2. Place CSV files in `datasets/` folder:
   - `programs_detailed_boostcamp_kaggle.csv`
   - `program_summary.csv`

### 1.4 Initialize the System

```bash
python init_models.py
```

This will:
- Load and preprocess workout data
- Train KMeans clustering model
- Generate text embeddings using SentenceTransformers
- Compute similarity matrix
- Initialize SQLite database with user tables
- Save all models to `models/` directory

Expected output:
```
Loading exercise data...
Loaded 100 unique workout programs
Creating new models...
Training KMeans with 36 clusters...
Creating program text embeddings...
Calculating similarity matrix...
Database initialized successfully!
✓ System initialized successfully!
```

### 1.5 Start the Flask Server

```bash
python app.py
```

✅ Backend running on `http://localhost:5000`

You should see:
```
Initializing database...
Initializing authentication...
Initializing workout tracker...
Loading workout recommender...
All components loaded successfully!
 * Running on http://0.0.0.0:5000
```

## Step 2: Frontend Setup

### 2.1 Navigate to Frontend Directory

Open a **new terminal** window and run:
```bash
cd frontend/workout-recommender
```

### 2.2 Install Node Dependencies

```bash
npm install
```

This installs:
- Next.js 16.0
- React 19.2
- Tailwind CSS 4.0
- Recharts (for charts)
- Three.js (for 3D animations)
- Lucide React (for icons)

### 2.3 Start the Development Server

```bash
npm run dev
```

✅ Frontend running on `http://localhost:3000`

You should see:
```
  ▲ Next.js 16.0.0
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.5s
```

## Step 3: Use the Application

### 3.1 Access the Application

Open your browser and navigate to **http://localhost:3000**

### 3.2 Create an Account

1. Click **"Login"** in the navigation bar
2. Click **"Sign up"** at the bottom
3. Fill in your details:
   - Name
   - Email
   - Password (minimum 6 characters)
4. Click **"Sign Up"**
5. You'll be automatically logged in and redirected

### 3.3 Get Workout Recommendations

1. On the home page, fill in your preferences:
   - **Fitness Level**: Beginner, Intermediate, or Advanced
   - **Goal**: Muscle, Strength, Endurance, Flexibility, etc.
   - **Equipment**: Gym, Home, Bodyweight, or Minimal
   - **Program Length**: Maximum weeks (optional)
   - **Time per Workout**: Maximum minutes (optional)

2. Click **"Generate My Workout Plan"**

3. Browse the top 10 recommended programs

4. Click **"Save Plan"** on any program you like

### 3.4 Track Your Progress

1. Go to **Dashboard** from the navigation bar

2. View your statistics:
   - Total workouts, minutes, calories
   - Current workout streak
   - Activity charts and patterns
   - Most active days

3. Click on a saved plan to:
   - View full exercise details
   - Log workout sessions
   - Track individual exercises
   - Monitor progress

### 3.5 Log a Workout Session

1. Open a saved plan from your dashboard
2. Click **"Log Workout"**
3. Enter session details:
   - Date
   - Week and day number
   - Duration (minutes)
   - Calories burned
   - Notes (optional)
4. Log individual exercises:
   - Sets completed
   - Reps completed
   - Weight used
5. Click **"Save Session"**

Your dashboard will automatically update with the new data! 🎉

## Troubleshooting

### Backend Issues

**Error: "No module named 'flask'"**
- Make sure you're in the `backend` folder
- Run: `pip install -r requirements.txt`

**Error: "Module 'jwt' has no attribute 'encode'"**
- This is a common issue with conflicting jwt packages
- Solution:
  ```bash
  pip uninstall jwt
  pip install PyJWT==2.9.0
  python verify_setup.py
  ```

**Error: "No such file or directory: datasets/..."**
- Run: `python generate_sample_data.py`
- Or download the full dataset from Kaggle

**Error: "Database not initialized"**
- The database is created automatically on first run
- If issues persist, delete `backend/models/workout_tracker.db` and restart

**Port 5000 already in use**
- Change the port in `app.py`: `app.run(port=5001)`
- Or stop the other application using port 5000

**Error: "Recommender not initialized"**
- Run: `python init_models.py`
- Check that dataset files exist in `datasets/` folder

### Frontend Issues

**Error: "Failed to connect to server"**
- Make sure the backend is running on port 5000
- Check the browser console for CORS errors
- Verify the API URL in frontend code

**Error: "Token expired"**
- Tokens expire after 24 hours
- Log in again to get a new token

**Module not found errors**
- Delete `node_modules` and `package-lock.json`
- Run: `npm install` again

**Build errors with Next.js**
- Make sure you have Node.js 16 or higher
- Try: `npm cache clean --force`
- Then: `npm install`

### Data Issues

**"No recommendations found"**
- Try different filter combinations
- Relax constraints (remove max_length and max_time)
- Check available options at `http://localhost:5000/api/options`

**Charts not displaying**
- Make sure you have logged at least 2 workout sessions
- Check browser console for errors
- Verify Recharts is installed: `npm list recharts`

## Verification Steps

### Test Backend

1. Health check:
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"healthy","recommender_loaded":true}`

2. Get options:
   ```bash
   curl http://localhost:5000/api/options
   ```
   Should return available goals, levels, and equipment

3. Test recommendation:
   ```bash
   curl -X POST http://localhost:5000/api/recommend \
     -H "Content-Type: application/json" \
     -d '{"goal":"muscle","level":"intermediate","equipment":"gym"}'
   ```

### Test Frontend

1. Open `http://localhost:3000` in your browser
2. You should see the landing page with hero section
3. Try signing up with a test account
4. Generate recommendations
5. Save a plan and check the dashboard

## Project Structure

```
FitRec-Workout-Recommender-Mini-Proj/
├── backend/                           # Flask API + ML
│   ├── app.py                         # Main server with all endpoints
│   ├── init_models.py                 # System initialization
│   ├── generate_sample_data.py        # Sample data generator
│   ├── verify_setup.py                # Dependency checker
│   ├── utils/                         # Core logic
│   │   ├── recommender.py             # ML recommendation engine
│   │   ├── auth.py                    # JWT authentication
│   │   ├── workout_tracker.py         # Progress tracking
│   │   └── tracker.py                 # Legacy tracking
│   ├── models/                        # Trained models & database
│   │   ├── database.py                # SQLite handler
│   │   ├── workout_tracker.db         # User database
│   │   ├── kmeans_model.pkl           # Clustering model
│   │   ├── ohe_encoder.pkl            # Encoder
│   │   ├── program_embeddings.npy     # Text embeddings
│   │   └── similarity_matrix.npy      # Similarities
│   └── requirements.txt
├── frontend/                          # Next.js app
│   └── workout-recommender/
│       ├── app/                       # Pages
│       │   ├── page.js                # Home
│       │   ├── dashboard/             # Dashboard
│       │   ├── login/                 # Login
│       │   ├── signup/                # Signup
│       │   └── plan/[id]/             # Plan details
│       ├── components/                # UI components
│       │   ├── RecommendSection.jsx   # Main recommendation UI
│       │   ├── Charts.jsx             # Data visualizations
│       │   ├── DashboardNavbar.jsx    # Navigation
│       │   └── ...
│       └── package.json
├── datasets/                          # Workout data
│   ├── programs_detailed_boostcamp_kaggle.csv
│   └── program_summary.csv
├── notebooks/                         # Jupyter analysis
├── README.md                          # Main documentation
├── ARCHITECTURE.md                    # System architecture
└── SETUP.md                           # This file
```

## Next Steps

- **Explore the API**: Check `http://localhost:5000/api/options`
- **Read the docs**: See `ARCHITECTURE.md` for system design
- **Customize**: Modify frontend components in `components/`
- **Add features**: Extend the API with new endpoints
- **Deploy**: See deployment recommendations in `ARCHITECTURE.md`

## Additional Resources

- **Backend API Docs**: `backend/README.md`
- **Dataset Info**: `datasets/data_description.md`
- **Jupyter Notebook**: `notebooks/personalized-workout-program-recommender.ipynb`
- **Kaggle Dataset**: https://www.kaggle.com/datasets/adnanelouardi/600k-fitness-exercise-and-workout-program-dataset

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run `python backend/verify_setup.py` to check dependencies
3. Check browser console for frontend errors
4. Check terminal output for backend errors

Happy training! 💪
