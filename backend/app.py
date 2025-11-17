from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from utils.recommender import WorkoutRecommender

app = Flask(__name__)
CORS(app)

# Initialize the recommender
recommender = None

def initialize_recommender():
    """Initialize the workout recommender on startup"""
    global recommender
    try:
        print("Loading workout recommender...")
        recommender = WorkoutRecommender()
        print("Recommender loaded successfully!")
    except Exception as e:
        print(f"Error loading recommender: {str(e)}")
        raise e

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'recommender_loaded': recommender is not None
    })

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    """
    Get workout recommendations based on user preferences
    
    Expected JSON payload:
    {
        "goal": "muscle",
        "level": "intermediate", 
        "equipment": "gym",
        "max_length": 12,  # optional, in weeks
        "max_time": 60     # optional, in minutes
    }
    """
    try:
        if recommender is None:
            return jsonify({'error': 'Recommender not initialized'}), 500
        
        data = request.json
        
        # Validate required fields
        required_fields = ['goal', 'level', 'equipment']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Get user preferences
        user_goal = data['goal'].lower()
        user_level = data['level'].lower()
        user_equipment = data['equipment'].lower()
        max_length = data.get('max_length', None)  # in weeks
        max_time = data.get('max_time', None)      # in minutes
        
        # Get recommendations
        recommendations = recommender.recommend(
            goal=user_goal,
            level=user_level,
            equipment=user_equipment,
            max_length=max_length,
            max_time=max_time,
            num_recommendations=5
        )
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
        
    except Exception as e:
        print(f"Error in recommendation: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/options', methods=['GET'])
def get_options():
    """Get available options for goals, levels, and equipment"""
    try:
        if recommender is None:
            return jsonify({'error': 'Recommender not initialized'}), 500
        
        options = recommender.get_available_options()
        return jsonify({
            'success': True,
            'options': options
        })
        
    except Exception as e:
        print(f"Error getting options: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Initialize recommender before starting the server
    initialize_recommender()
    
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
