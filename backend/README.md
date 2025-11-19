# FitRec Backend API

This is the backend API for the FitRec Workout Recommender system. It uses machine learning to recommend personalized workout programs based on user preferences.

## Features

- **ML-based recommendations** using KMeans clustering on workout metadata
- **RESTful API** built with Flask
- **CORS enabled** for frontend integration
- **Flexible filtering** by goal, level, equipment, duration, and time

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

### 3. Initialize the Models

Run the initialization script to preprocess data and create ML models:

```bash
python init_models.py
```

This will:
- Load and preprocess the workout data
- Create KMeans clustering models
- Save trained models to the `models/` directory
- Verify the system is working correctly

### 4. Start the Server

Run the Flask development server:

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```
Returns server status and whether the recommender is loaded.

**Response:**
```json
{
  "status": "healthy",
  "recommender_loaded": true
}
```

### Get Available Options
```
GET /api/options
```
Returns all available options for goals, levels, and equipment.

**Response:**
```json
{
  "success": true,
  "options": {
    "goals": ["muscle", "strength", "endurance", ...],
    "levels": ["beginner", "intermediate", "advanced"],
    "equipment": ["gym", "home", "bodyweight", ...]
  }
}
```

### Get Recommendations
```
POST /api/recommend
```

Get personalized workout recommendations.

**Request Body:**
```json
{
  "goal": "muscle",
  "level": "intermediate",
  "equipment": "gym",
  "max_length": 12,     // optional, in weeks
  "max_time": 60        // optional, in minutes
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "title": "Program Name",
      "description": "Program description...",
      "goal": "Muscle",
      "level": "Intermediate",
      "equipment": "Gym",
      "program_length": 12,
      "time_per_workout": 60,
      "total_exercises": 150,
      "exercises": [
        {
          "name": "Bench Press",
          "week": 1,
          "day": 1,
          "sets": "4",
          "reps": "8-12",
          "intensity": "medium"
        },
        // ... more exercises
      ]
    }
    // ... more recommendations
  ]
}
```

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── init_models.py         # Model initialization script
├── requirements.txt       # Python dependencies
├── models/               # Trained ML models (generated)
│   ├── kmeans_model.pkl
│   └── ohe_encoder.pkl
└── utils/
    ├── __init__.py
    ├── tracker.py         # Simple tracking persister
    └── recommender.py    # Core recommendation logic
```

## How It Works

1. **Data Loading**: Loads workout data from CSV files in the datasets folder
2. **Preprocessing**: Cleans and normalizes goal, level, and equipment metadata
3. **Clustering**: Uses KMeans to group similar workout programs
4. **Recommendation**: Finds the best cluster for user preferences and returns filtered results

## Environment Variables

- `PORT`: Server port (default: 5000)

## Development

To run in debug mode (auto-reload on code changes):
```bash
python app.py
```

## Troubleshooting

**Error: "Recommender not initialized"**
- Make sure you ran `python init_models.py` before starting the server
- Check that dataset files exist in the `datasets/` folder

**Error: "No recommendations found"**
- Try different filter combinations
- Check available options using `/api/options` endpoint
- Relax constraints like max_length and max_time

### New Endpoints

#### Select Plan
```
POST /api/select_plan
```
Body:
```json
{ "user_id": "<optional>" , "title": "Program 1: Muscle Training" }
```
Returns a `user_id` (set in localStorage on frontend), the new tracking entry, and `similar` plans.

#### Update Tracking
```
POST /api/track
```
Body:
```json
{ "user_id": "...", "title": "Program 1...", "progress": 50, "note": "Did 3 workouts this week" }
```

#### Get Tracking
```
GET /api/tracking?user_id=<id>
```
Returns stored tracking entries for that user.

## License

MIT
