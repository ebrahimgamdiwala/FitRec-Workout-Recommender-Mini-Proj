# 🏗️ FitRec System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│                      (Browser: localhost:3000)                   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP Requests (JSON)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                              │
│                        (Next.js 16)                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Components/RecommendSection.jsx                         │   │
│  │  • User Input Form                                       │   │
│  │  • API Integration (fetch)                               │   │
│  │  • Recommendation Display                                │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ POST /api/recommend
                            │ GET /api/options
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND API                                │
│                    (Flask 3.1 - Port 5000)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  app.py - REST API Endpoints                            │   │
│  │  ├── /health         (GET)  - Health check              │   │
│  │  ├── /api/options    (GET)  - Available options         │   │
│  │  └── /api/recommend  (POST) - Get recommendations       │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Python Function Calls
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ML RECOMMENDATION ENGINE                      │
│                  (utils/recommender.py)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  WorkoutRecommender Class                               │   │
│  │  ├── _load_data()          - Load datasets              │   │
│  │  ├── _load_or_create_models() - Load/train models       │   │
│  │  ├── get_available_options() - Return options           │   │
│  │  └── recommend()            - Generate recommendations   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            │                                     │
│        ┌───────────────────┼───────────────────┐                │
│        ▼                   ▼                   ▼                │
│  ┌─────────┐         ┌─────────┐        ┌──────────┐           │
│  │ KMeans  │         │   OHE   │        │ Pandas   │           │
│  │ Model   │         │ Encoder │        │ DataFrames│          │
│  └─────────┘         └─────────┘        └──────────┘           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Read CSV Files
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│                    (datasets/ folder)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  programs_detailed_boostcamp_kaggle.csv                 │   │
│  │  • 12,036 exercise entries                              │   │
│  │  • Fields: title, goal, level, equipment, week, day,    │   │
│  │           exercise_name, sets, reps, intensity          │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  program_summary.csv                                    │   │
│  │  • 100 unique programs                                  │   │
│  │  • Fields: title, description, goal, level, equipment,  │   │
│  │           program_length, time_per_workout              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────┐
│   USER   │
└────┬─────┘
     │
     │ 1. Selects preferences
     ▼
┌─────────────────────────┐
│   Frontend Form         │
│  • Goal: muscle         │
│  • Level: intermediate  │
│  • Equipment: gym       │
│  • Max Length: 12 weeks │
│  • Max Time: 60 min     │
└────┬────────────────────┘
     │
     │ 2. POST request with JSON
     ▼
┌─────────────────────────┐
│  Flask API Endpoint     │
│  /api/recommend         │
└────┬────────────────────┘
     │
     │ 3. Extract & validate input
     ▼
┌─────────────────────────┐
│  Recommender Engine     │
│  ┌──────────────────┐  │
│  │ 4. One-hot encode│  │
│  │    user input    │  │
│  └────┬─────────────┘  │
│       │                 │
│  ┌────▼─────────────┐  │
│  │ 5. Predict       │  │
│  │    cluster       │  │
│  │    (KMeans)      │  │
│  └────┬─────────────┘  │
│       │                 │
│  ┌────▼─────────────┐  │
│  │ 6. Filter by     │  │
│  │    length/time   │  │
│  └────┬─────────────┘  │
│       │                 │
│  ┌────▼─────────────┐  │
│  │ 7. Get top 5     │  │
│  │    programs      │  │
│  └────┬─────────────┘  │
│       │                 │
│  ┌────▼─────────────┐  │
│  │ 8. Fetch exercise│  │
│  │    details       │  │
│  └────┬─────────────┘  │
└───────┼─────────────────┘
        │
        │ 9. JSON response
        ▼
┌─────────────────────────┐
│  Frontend Display       │
│  ┌──────────────────┐  │
│  │  Recommendation  │  │
│  │  ┌────────────┐  │  │
│  │  │ Title      │  │  │
│  │  │ Stats      │  │  │
│  │  │ Exercises  │  │  │
│  │  └────────────┘  │  │
│  └──────────────────┘  │
└─────────────────────────┘
        │
        ▼
┌──────────┐
│   USER   │
└──────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│  │  Next.js   │  │   React    │  │  Tailwind CSS   │   │
│  │   16.0     │  │   19.2     │  │      4.0        │   │
│  └────────────┘  └────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                     API/BACKEND LAYER                    │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│  │   Flask    │  │ Flask-CORS │  │  Python 3.8+    │   │
│  │   3.1.0    │  │   5.0.0    │  │                 │   │
│  └────────────┘  └────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  MACHINE LEARNING LAYER                  │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│  │  sklearn   │  │   pandas   │  │     numpy       │   │
│  │   1.7.2    │  │   2.3.3    │  │     2.3.4       │   │
│  └────────────┘  └────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       DATA LAYER                         │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│  │    CSV     │  │   pickle   │  │    JSON         │   │
│  │  (pandas)  │  │  (models)  │  │  (API data)     │   │
│  └────────────┘  └────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## ML Model Architecture

```
User Input
    │
    ├─ goal: "muscle"
    ├─ level: "intermediate"
    └─ equipment: "gym"
    │
    ▼
┌─────────────────────────┐
│  One-Hot Encoder (OHE)  │
│  Transforms categorical │
│  features to binary     │
└────────┬────────────────┘
         │
         │ Encoded Vector [0,1,0,1,0,0,...]
         ▼
┌─────────────────────────┐
│     KMeans Model        │
│  • 36 clusters          │
│  • Trained on metadata  │
│  • Predicts cluster ID  │
└────────┬────────────────┘
         │
         │ Cluster ID: 12
         ▼
┌─────────────────────────┐
│   Filter Programs       │
│  • Get programs in      │
│    cluster 12           │
│  • Apply length filter  │
│  • Apply time filter    │
└────────┬────────────────┘
         │
         │ Filtered Programs
         ▼
┌─────────────────────────┐
│   Sample Top 5          │
│  • Random sampling      │
│  • Return 5 best        │
└────────┬────────────────┘
         │
         ▼
    Recommendations
```

## File Structure

```
FitRec-Workout-Recommender-Mini-Proj/
│
├── frontend/
│   └── workout-recommender/
│       ├── app/
│       │   ├── page.js                 # Main page
│       │   ├── layout.js               # App layout
│       │   └── globals.css             # Global styles
│       ├── components/
│       │   ├── RecommendSection.jsx    # ⭐ Main form & results
│       │   ├── HeroSection.jsx
│       │   ├── FeaturesSection.jsx
│       │   └── ...
│       └── package.json
│
├── backend/
│   ├── app.py                          # ⭐ Flask server
│   ├── init_models.py                  # Model initialization
│   ├── generate_sample_data.py         # Data generator
│   ├── requirements.txt
│   ├── utils/
│   │   ├── __init__.py
│   │   └── recommender.py              # ⭐ ML engine
│   └── models/
│       ├── kmeans_model.pkl            # Trained model
│       └── ohe_encoder.pkl             # Encoder
│
├── datasets/
│   ├── program_summary.csv             # ⭐ 100 programs
│   └── programs_detailed_boostcamp_kaggle.csv  # ⭐ 12K exercises
│
├── notebooks/
│   └── personalized-workout-program-recommender.ipynb
│
├── README.md                            # Main documentation
├── SETUP.md                            # Setup guide
└── INTEGRATION_SUMMARY.md              # This file
```

## API Contract

### Request Format
```typescript
interface RecommendRequest {
  goal: string;           // Required: "muscle" | "strength" | "endurance" | ...
  level: string;          // Required: "beginner" | "intermediate" | "advanced"
  equipment: string;      // Required: "gym" | "home" | "bodyweight" | ...
  max_length?: number;    // Optional: max program length in weeks
  max_time?: number;      // Optional: max time per workout in minutes
}
```

### Response Format
```typescript
interface RecommendResponse {
  success: boolean;
  recommendations: Recommendation[];
  error?: string;
}

interface Recommendation {
  title: string;
  description: string;
  goal: string;
  level: string;
  equipment: string;
  program_length: number;     // in weeks
  time_per_workout: number;   // in minutes
  total_exercises: number;
  exercises: Exercise[];
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

---

**Architecture Version**: 1.0
**Last Updated**: November 17, 2025
