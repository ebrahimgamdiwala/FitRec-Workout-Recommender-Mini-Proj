"""
Initialization script to preload models and verify setup
Run this before starting the server for the first time
"""
from utils.recommender import WorkoutRecommender

def main():
    print("=" * 60)
    print("Initializing Workout Recommender System")
    print("=" * 60)
    
    try:
        # Initialize recommender (this will create models if they don't exist)
        recommender = WorkoutRecommender()
        
        # Get available options
        options = recommender.get_available_options()
        
        print("\n✓ System initialized successfully!")
        print(f"\nAvailable Goals: {', '.join(options['goals'])}")
        print(f"Available Levels: {', '.join(options['levels'])}")
        print(f"Available Equipment: {', '.join(options['equipment'])}")
        
        # Test recommendation
        print("\n" + "=" * 60)
        print("Testing recommendation system...")
        print("=" * 60)
        
        test_recommendations = recommender.recommend(
            goal='muscle',
            level='intermediate',
            equipment='gym',
            num_recommendations=2
        )
        
        print(f"\n✓ Generated {len(test_recommendations)} test recommendations")
        if test_recommendations:
            print(f"\nSample recommendation: {test_recommendations[0]['title']}")
        
        print("\n" + "=" * 60)
        print("✓ All systems ready! You can now start the Flask server.")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error during initialization: {str(e)}")
        raise

if __name__ == "__main__":
    main()
