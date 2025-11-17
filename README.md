# 🏋️ FitRec - AI-Powered Workout Recommender

An intelligent workout recommendation system that uses machine learning to provide personalized fitness programs based on user preferences.

## 🌟 Features

- **AI-Powered Recommendations**: Uses KMeans clustering on 600K+ workout data
- **Personalized Plans**: Tailored to your fitness level, goals, and equipment
- **Interactive Frontend**: Modern Next.js UI with smooth animations
- **RESTful API**: Flask backend with ML integration
- **Flexible Filtering**: Filter by program length and workout duration

## 🏗️ Project Structure

```
FitRec-Workout-Recommender-Mini-Proj/
├── frontend/
│   └── workout-recommender/    # Next.js frontend application
│       ├── app/                # Next.js app directory
│       ├── components/         # React components
│       └── package.json
├── backend/
│   ├── app.py                 # Flask API server
│   ├── init_models.py         # Model initialization script
│   ├── utils/
│   │   └── recommender.py     # ML recommendation engine
│   ├── models/                # Trained models (generated)
│   └── requirements.txt
├── datasets/
│   ├── programs_detailed_boostcamp_kaggle.csv
│   └── program_summary.csv
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

1. **Select Your Fitness Level**: Beginner, Intermediate, or Advanced
2. **Choose Your Goal**: Muscle Building, Strength, Endurance, or Flexibility
3. **Specify Equipment**: Gym, Home, or Bodyweight
4. **Set Preferences**: Program length and time per workout
5. **Get Recommendations**: Click "Generate My Workout Plan"

The system will analyze 600K+ workout programs and recommend the top 5 that match your preferences!

## 🔧 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### Get Recommendations
```http
POST /api/recommend
Content-Type: application/json

{
  "goal": "muscle",
  "level": "intermediate",
  "equipment": "gym",
  "max_length": 12,
  "max_time": 60
}
```

#### Get Available Options
```http
GET /api/options
```

#### Health Check
```http
GET /health
```

See [backend/README.md](backend/README.md) for detailed API documentation.

## 🧠 Machine Learning Approach

The recommendation system uses:

1. **Data Preprocessing**: Cleans and normalizes workout metadata
2. **Feature Engineering**: One-hot encoding of categorical features (goal, level, equipment)
3. **Clustering**: KMeans algorithm to group similar workout programs
4. **Recommendation**: Finds the best cluster matching user preferences and applies filters

### Dataset

- **600K+ workout entries** from fitness programs
- **2,598 unique programs** with detailed metadata
- Features: goal, level, equipment, duration, exercises, intensity

Source: [Kaggle Fitness Exercise Dataset](https://www.kaggle.com/datasets/adnanelouardi/600k-fitness-exercise-and-workout-program-dataset)

## 🛠️ Technology Stack

### Frontend
- Next.js 16.0
- React 19.2
- Tailwind CSS 4
- Lucide React (icons)
- Three.js (3D animations)

### Backend
- Flask 3.1
- scikit-learn 1.7
- pandas 2.3
- numpy 2.3
- sentence-transformers 5.1

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

**"Module not found" errors**
- Install all dependencies: `pip install -r requirements.txt`

### Frontend Issues

**"Failed to connect to server"**
- Make sure the backend is running on port 5000
- Check CORS settings if running on different domains

**"No recommendations found"**
- Try different filter combinations
- Check available options at `http://localhost:5000/api/options`

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
