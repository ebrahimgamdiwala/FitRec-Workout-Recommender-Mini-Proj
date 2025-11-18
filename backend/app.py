from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from utils.recommender import WorkoutRecommender
from utils.tracker import Tracker

app = Flask(__name__)
CORS(app)

# Initialize the recommender
recommender = None
tracker = None

def initialize_recommender():
    """Initialize the workout recommender on startup"""
    global recommender
    try:
        print("Loading workout recommender...")
        recommender = WorkoutRecommender()
        # Setup tracker
        global tracker
        tracker = Tracker()
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
        
        # Use the new top-k recommender that mixes embeddings and metadata
        num_recommendations = data.get('num_recommendations', 10)
        recommendations = recommender.top_k_recommendations(
            goal=user_goal,
            level=user_level,
            equipment=user_equipment,
            max_length=max_length,
            max_time=max_time,
            num_recommendations=num_recommendations
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


@app.route('/api/select_plan', methods=['POST'])
def select_plan():
    """Select a plan to track and return similar plans"""
    try:
        if recommender is None:
            return jsonify({'error': 'Recommender not initialized'}), 500
        if tracker is None:
            return jsonify({'error': 'Tracker not initialized'}), 500

        data = request.json
        user_id = data.get('user_id', None)
        selected_title = data.get('title', None)
        if selected_title is None:
            return jsonify({'error': 'Missing title for selected plan'}), 400

        # If no user_id provided, create a new anon id
        if not user_id:
            import uuid
            user_id = str(uuid.uuid4())

        # Start tracking
        entry = tracker.start_tracking(user_id, selected_title)

        # Recommend more similar plans
        similar = recommender.get_similar_plans(selected_title, num_similar=5)

        return jsonify({
            'success': True,
            'user_id': user_id,
            'tracking': entry,
            'similar': similar
        })

    except Exception as e:
        print(f"Error selecting plan: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/track', methods=['POST'])
def update_tracking():
    try:
        data = request.json
        user_id = data.get('user_id')
        title = data.get('title')
        progress_value = data.get('progress')
        note = data.get('note', None)

        if not user_id or not title or progress_value is None:
            return jsonify({'error': 'Missing required fields'}), 400

        entry = tracker.update_progress(user_id, title, float(progress_value), note)
        return jsonify({'success': True, 'tracking': entry})
    except Exception as e:
        print(f"Error updating tracking: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/tracking', methods=['GET'])
def get_tracking():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'Missing user_id query param'}), 400
        result = tracker.get_tracking(user_id)
        return jsonify({'success': True, 'tracking': result})
    except Exception as e:
        print(f"Error getting tracking: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

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

@app.route('/api/plan/<plan_title>', methods=['GET'])
def get_plan_details(plan_title):
    """Get full details of a specific plan including all exercises"""
    try:
        if recommender is None:
            return jsonify({'error': 'Recommender not initialized'}), 500
        
        plan = recommender.get_plan_by_title(plan_title)
        if plan is None:
            return jsonify({'error': 'Plan not found'}), 404
            
        return jsonify({
            'success': True,
            'plan': plan
        })
        
    except Exception as e:
        print(f"Error getting plan details: {str(e)}")
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
