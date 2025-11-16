# 🚀 Quick Setup Guide

Follow these steps to get FitRec up and running:

## Step 1: Backend Setup

1. **Open a terminal** and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Generate sample data** (if you don't have the full dataset):
   ```bash
   python generate_sample_data.py
   ```
   
   > **Note**: To use the full 600K+ dataset, download it from [Kaggle](https://www.kaggle.com/datasets/adnanelouardi/600k-fitness-exercise-and-workout-program-dataset) and place the CSV files in the `datasets/` folder.

4. **Initialize the ML models**:
   ```bash
   python init_models.py
   ```

5. **Start the Flask server**:
   ```bash
   python app.py
   ```
   
   ✅ Backend running on `http://localhost:5000`

## Step 2: Frontend Setup

1. **Open a new terminal** and navigate to the frontend folder:
   ```bash
   cd frontend/workout-recommender
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   ✅ Frontend running on `http://localhost:3000`

## Step 3: Use the Application

1. Open your browser and go to **http://localhost:3000**
2. Fill in your preferences:
   - Fitness Level (Beginner/Intermediate/Advanced)
   - Goal (Muscle/Strength/Endurance/Flexibility)
   - Equipment (Gym/Home/Bodyweight)
   - Program Length (in weeks)
   - Time per Workout (in minutes)
3. Click **"Generate My Workout Plan"**
4. View your personalized recommendations! 🎉

## Troubleshooting

### Backend Issues

**Error: "No module named 'flask'"**
- Make sure you're in the `backend` folder
- Run: `pip install -r requirements.txt`

**Error: "No such file or directory: datasets/..."**
- Run: `python generate_sample_data.py`
- Or download the full dataset from Kaggle

**Port 5000 already in use**
- Change the port in `app.py` or stop the other application using port 5000

### Frontend Issues

**Error: "Failed to connect to server"**
- Make sure the backend is running on port 5000
- Check the browser console for CORS errors

**Module not found errors**
- Delete `node_modules` and `package-lock.json`
- Run: `npm install` again

## Next Steps

- Explore the API endpoints at `http://localhost:5000/api/options`
- Check the Jupyter notebook in `notebooks/` to understand the ML approach
- Customize the frontend styling in `components/`
- Add more features like workout tracking, progress monitoring, etc.

## Project Structure

```
FitRec-Workout-Recommender-Mini-Proj/
├── backend/              # Flask API + ML
│   ├── app.py           # Main server
│   ├── utils/           # ML logic
│   └── models/          # Trained models
├── frontend/            # Next.js app
│   └── workout-recommender/
│       ├── app/         # Pages
│       └── components/  # UI components
├── datasets/            # Workout data
└── notebooks/           # Jupyter analysis
```

Happy coding! 💪
