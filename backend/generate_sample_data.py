"""
Script to generate sample/mock data for testing when the full dataset is not available.
This creates a smaller dataset with realistic workout data.
"""

import pandas as pd
import os
import random

def generate_sample_data():
    """Generate sample workout data for testing"""
    
    # Define options
    goals = ['muscle', 'strength', 'endurance', 'flexibility', 'cardio', 'fat loss']
    levels = ['beginner', 'intermediate', 'advanced']
    equipment_types = ['gym', 'home', 'bodyweight', 'minimal']
    
    exercises = [
        'Bench Press', 'Squat', 'Deadlift', 'Pull-ups', 'Push-ups', 'Lunges',
        'Shoulder Press', 'Rows', 'Bicep Curls', 'Tricep Dips', 'Plank',
        'Leg Press', 'Leg Curls', 'Lat Pulldown', 'Cable Flyes', 'Running',
        'Jump Rope', 'Burpees', 'Mountain Climbers', 'Box Jumps'
    ]
    
    intensities = ['low', 'medium', 'high']
    
    # Generate program data
    program_data = []
    detailed_data = []
    
    for i in range(100):  # 100 sample programs
        title = f"Program {i+1}: {random.choice(goals).title()} Training"
        goal = random.choice(goals)
        level = random.choice(levels)
        equipment = random.choice(equipment_types)
        program_length = random.choice([4, 6, 8, 10, 12, 16])
        time_per_workout = random.choice([30, 45, 60, 75, 90])
        
        description = f"A comprehensive {program_length}-week {goal} program designed for {level} athletes using {equipment} equipment. Each workout takes approximately {time_per_workout} minutes."
        
        # Add to program summary
        program_data.append({
            'title': title,
            'description': description,
            'level': level,
            'goal': goal,
            'equipment': equipment,
            'program_length': program_length,
            'time_per_workout': time_per_workout,
            'total_exercises': random.randint(40, 200),
            'created': '2024-01-01',
            'last_edit': '2024-06-01'
        })
        
        # Generate exercises for this program
        num_weeks = min(4, program_length)  # Generate first 4 weeks
        for week in range(1, num_weeks + 1):
            for day in range(1, 6):  # 5 days per week
                num_exercises = random.randint(4, 8)
                for _ in range(num_exercises):
                    exercise = random.choice(exercises)
                    sets = random.randint(2, 5)
                    reps = random.choice(['8-12', '10-15', '12-15', '15-20', '5-8'])
                    intensity = random.choice(intensities)
                    
                    detailed_data.append({
                        'title': title,
                        'description': description,
                        'level': level,
                        'goal': goal,
                        'equipment': equipment,
                        'program_length': program_length,
                        'time_per_workout': time_per_workout,
                        'week': week,
                        'day': day,
                        'exercise_name': exercise,
                        'sets': sets,
                        'reps': reps,
                        'intensity': intensity
                    })
    
    # Create DataFrames
    program_df = pd.DataFrame(program_data)
    detailed_df = pd.DataFrame(detailed_data)
    
    # Save to CSV
    datasets_dir = os.path.join(os.path.dirname(__file__), '..', 'datasets')
    os.makedirs(datasets_dir, exist_ok=True)
    
    program_df.to_csv(os.path.join(datasets_dir, 'program_summary.csv'), index=False)
    detailed_df.to_csv(os.path.join(datasets_dir, 'programs_detailed_boostcamp_kaggle.csv'), index=False)
    
    print(f"✓ Generated {len(program_df)} programs")
    print(f"✓ Generated {len(detailed_df)} exercise entries")
    print(f"✓ Files saved to {datasets_dir}")

if __name__ == "__main__":
    print("Generating sample workout data...")
    print("=" * 60)
    generate_sample_data()
    print("=" * 60)
    print("Sample data generated successfully!")
    print("\nNote: This is sample data for testing.")
    print("For production use, download the full dataset from:")
    print("https://www.kaggle.com/datasets/adnanelouardi/600k-fitness-exercise-and-workout-program-dataset")
