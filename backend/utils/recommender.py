import pandas as pd
import numpy as np
import pickle
import os
from sklearn.preprocessing import OneHotEncoder
from sklearn.cluster import KMeans
import ast

class WorkoutRecommender:
    """
    Workout recommendation system based on metadata clustering
    """
    
    def __init__(self):
        """Initialize the recommender by loading preprocessed data and models"""
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.models_dir = os.path.join(self.base_dir, 'models')
        
        # Load preprocessed data and models
        self._load_data()
        self._load_or_create_models()
    
    def _clean_and_parse(self, s):
        """Clean and parse string values from dataset"""
        if not isinstance(s, str):
            return np.nan
        s = s.strip()
        try:
            val = ast.literal_eval(s)
            if isinstance(val, list) and len(val) > 0:
                return val[0]
            return val
        except (ValueError, SyntaxError):
            return s
    
    def _load_data(self):
        """Load and preprocess the exercise data"""
        print("Loading exercise data...")
        
        # Path to datasets
        datasets_dir = os.path.join(self.base_dir, '..', 'datasets')
        ex_file = os.path.join(datasets_dir, 'programs_detailed_boostcamp_kaggle.csv')
        prog_file = os.path.join(datasets_dir, 'program_summary.csv')
        
        # Load data
        ex_df = pd.read_csv(ex_file)
        prog_df = pd.read_csv(prog_file)
        
        # Drop unnamed columns
        if 'Unnamed: 0' in ex_df.columns:
            ex_df = ex_df.drop(columns=['Unnamed: 0'])
        if 'Unnamed: 0' in prog_df.columns:
            prog_df = prog_df.drop(columns=['Unnamed: 0'])
        
        # Get unique programs from exercises
        self.df_meta = ex_df.drop_duplicates(subset=['title'], keep='first').copy()
        
        # Clean metadata columns
        for col in ['goal', 'level', 'equipment']:
            self.df_meta[col] = self.df_meta[col].apply(self._clean_and_parse)
        
        # Drop rows with missing metadata
        self.df_meta.dropna(subset=['goal', 'level', 'equipment', 'description', 'title'], inplace=True)
        
        # Convert to lowercase
        self.df_meta['goal'] = self.df_meta['goal'].astype(str).str.lower()
        self.df_meta['level'] = self.df_meta['level'].astype(str).str.lower()
        self.df_meta['equipment'] = self.df_meta['equipment'].astype(str).str.lower()
        
        # Merge with program summary to get length and time info if needed
        if 'program_length' not in self.df_meta.columns or 'time_per_workout' not in self.df_meta.columns:
            self.df_meta = pd.merge(
                self.df_meta,
                prog_df[['title', 'program_length', 'time_per_workout']],
                on='title',
                how='left',
                suffixes=('', '_prog')
            )
        
        # Fill NaN values for length and time
        self.df_meta['program_length'].fillna(self.df_meta['program_length'].median(), inplace=True)
        self.df_meta['time_per_workout'].fillna(self.df_meta['time_per_workout'].median(), inplace=True)
        
        # Store exercises for detailed recommendations
        self.ex_df_full = ex_df
        
        print(f"Loaded {len(self.df_meta)} unique workout programs")
    
    def _load_or_create_models(self):
        """Load existing models or create new ones"""
        kmeans_path = os.path.join(self.models_dir, 'kmeans_model.pkl')
        encoder_path = os.path.join(self.models_dir, 'ohe_encoder.pkl')
        
        if os.path.exists(kmeans_path) and os.path.exists(encoder_path):
            print("Loading existing models...")
            with open(kmeans_path, 'rb') as f:
                self.kmeans_model = pickle.load(f)
            with open(encoder_path, 'rb') as f:
                self.ohe_encoder = pickle.load(f)
            
            # Apply clustering to data
            features = self.df_meta[['goal', 'level', 'equipment']].copy()
            features.fillna('unknown', inplace=True)
            encoded_features = self.ohe_encoder.transform(features)
            self.df_meta['cluster_metadata'] = self.kmeans_model.predict(encoded_features)
            
            print("Models loaded successfully!")
        else:
            print("Creating new models...")
            self._create_models()
    
    def _create_models(self):
        """Create and train clustering models"""
        # Prepare features
        features = self.df_meta[['goal', 'level', 'equipment']].copy()
        features.fillna('unknown', inplace=True)
        
        # One-hot encode features
        self.ohe_encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
        encoded_features = self.ohe_encoder.fit_transform(features)
        
        # Determine number of clusters
        num_clusters = min(
            len(self.df_meta['goal'].unique()) * len(self.df_meta['level'].unique()) * 2,
            len(self.df_meta)
        )
        
        # Train KMeans
        print(f"Training KMeans with {num_clusters} clusters...")
        self.kmeans_model = KMeans(n_clusters=num_clusters, random_state=42, n_init=10)
        self.kmeans_model.fit(encoded_features)
        self.df_meta['cluster_metadata'] = self.kmeans_model.labels_
        
        # Save models
        os.makedirs(self.models_dir, exist_ok=True)
        with open(os.path.join(self.models_dir, 'kmeans_model.pkl'), 'wb') as f:
            pickle.dump(self.kmeans_model, f)
        with open(os.path.join(self.models_dir, 'ohe_encoder.pkl'), 'wb') as f:
            pickle.dump(self.ohe_encoder, f)
        
        print("Models created and saved successfully!")
    
    def get_available_options(self):
        """Get all available options for goals, levels, and equipment"""
        return {
            'goals': sorted([g for g in self.df_meta['goal'].unique() if g != 'unknown']),
            'levels': sorted([l for l in self.df_meta['level'].unique() if l != 'unknown']),
            'equipment': sorted([e for e in self.df_meta['equipment'].unique() if e != 'unknown'])
        }
    
    def recommend(self, goal, level, equipment, max_length=None, max_time=None, num_recommendations=5):
        """
        Get workout recommendations based on user preferences
        
        Args:
            goal: User's fitness goal
            level: User's fitness level
            equipment: Available equipment
            max_length: Maximum program length in weeks (optional)
            max_time: Maximum time per workout in minutes (optional)
            num_recommendations: Number of recommendations to return
            
        Returns:
            List of recommended workout programs
        """
        # Create user input dataframe
        user_input_df = pd.DataFrame([[goal.lower(), level.lower(), equipment.lower()]],
                                     columns=['goal', 'level', 'equipment'])
        
        # Encode user input
        user_encoded = self.ohe_encoder.transform(user_input_df)
        
        # Predict cluster
        user_cluster = self.kmeans_model.predict(user_encoded)[0]
        
        # Filter by cluster
        cluster_workouts = self.df_meta[self.df_meta['cluster_metadata'] == user_cluster].copy()
        
        # Apply additional filters
        if max_length is not None:
            cluster_workouts = cluster_workouts[cluster_workouts['program_length'] <= max_length]
        
        if max_time is not None:
            cluster_workouts = cluster_workouts[cluster_workouts['time_per_workout'] <= max_time]
        
        # Check if we have any results
        if cluster_workouts.empty:
            return []
        
        # Sample recommendations
        if len(cluster_workouts) > num_recommendations:
            recommendations = cluster_workouts.sample(n=num_recommendations, random_state=42)
        else:
            recommendations = cluster_workouts
        
        # Format recommendations
        result = []
        for _, row in recommendations.iterrows():
            # Get exercises for this program
            program_exercises = self.ex_df_full[self.ex_df_full['title'] == row['title']].sort_values(
                by=['week', 'day']
            )
            
            # Get first 10 exercises as sample
            exercises = []
            for _, ex in program_exercises.head(10).iterrows():
                exercises.append({
                    'name': str(ex['exercise_name']),
                    'week': int(ex['week']) if pd.notna(ex['week']) else None,
                    'day': int(ex['day']) if pd.notna(ex['day']) else None,
                    'sets': str(ex['sets']) if pd.notna(ex['sets']) else 'N/A',
                    'reps': str(ex['reps']) if pd.notna(ex['reps']) else 'N/A',
                    'intensity': str(ex['intensity']) if pd.notna(ex['intensity']) else 'N/A'
                })
            
            result.append({
                'title': row['title'],
                'description': str(row['description']),
                'goal': str(row['goal']).title(),
                'level': str(row['level']).title(),
                'equipment': str(row['equipment']).title(),
                'program_length': int(row['program_length']) if pd.notna(row['program_length']) else None,
                'time_per_workout': int(row['time_per_workout']) if pd.notna(row['time_per_workout']) else None,
                'exercises': exercises,
                'total_exercises': len(program_exercises)
            })
        
        return result
