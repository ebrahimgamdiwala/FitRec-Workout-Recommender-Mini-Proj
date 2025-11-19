from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from utils.recommender import WorkoutRecommender
from utils.tracker import Tracker
from models.database import Database
from utils.auth import AuthManager, token_required
from utils.workout_tracker import WorkoutTracker

app = Flask(__name__)
CORS(app)

# Initialize components
recommender = None
tracker = None
db = None
auth_manager = None
workout_tracker = None

def initialize_app():
    """Initialize all app components on startup"""
    global recommender, tracker, db, auth_manager, workout_tracker
    try:
        print("Initializing database...")
        db = Database()
        
        print("Initializing authentication...")
        auth_manager = AuthManager(db)
        
        print("Initializing workout tracker...")
        workout_tracker = WorkoutTracker(db)
        
        print("Loading workout recommender...")
        recommender = WorkoutRecommender()
        
        print("Setting up legacy tracker...")
        tracker = Tracker()
        
        print("All components loaded successfully!")
    except Exception as e:
        print(f"Error initializing app: {str(e)}")
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

# ============= Authentication Endpoints =============

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not all([email, password, name]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        user_data, error = auth_manager.register_user(email, password, name)
        
        if error:
            return jsonify({'error': error}), 400
        
        return jsonify({
            'success': True,
            'user': user_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'Missing email or password'}), 400
        
        user_data, error = auth_manager.login_user(email, password)
        
        if error:
            return jsonify({'error': error}), 401
        
        return jsonify({
            'success': True,
            'user': user_data
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current user info"""
    try:
        user = auth_manager.get_user_by_id(request.user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= Workout Plan Management =============

@app.route('/api/plans/save', methods=['POST'])
@token_required
def save_workout_plan():
    """Save a workout plan for the authenticated user"""
    try:
        data = request.json
        plan_title = data.get('plan_title')
        plan_data = data.get('plan_data')
        
        if not plan_title or not plan_data:
            return jsonify({'error': 'Missing plan_title or plan_data'}), 400
        
        result = workout_tracker.save_plan(request.user_id, plan_title, plan_data)
        
        return jsonify({
            'success': True,
            'result': result
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plans', methods=['GET'])
@token_required
def get_user_plans():
    """Get all saved plans for the authenticated user"""
    try:
        plans = workout_tracker.get_user_plans(request.user_id)
        return jsonify({
            'success': True,
            'plans': plans
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plans/<int:plan_id>/complete', methods=['POST'])
@token_required
def complete_workout_plan(plan_id):
    """Mark a plan as completed"""
    try:
        workout_tracker.complete_plan(request.user_id, plan_id)
        return jsonify({
            'success': True,
            'message': 'Plan marked as completed'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= Workout Session Tracking =============

@app.route('/api/sessions/log', methods=['POST'])
@token_required
def log_workout_session():
    """Log a completed workout session"""
    try:
        data = request.json
        plan_id = data.get('plan_id')
        session_date = data.get('session_date')
        week_number = data.get('week_number')
        day_number = data.get('day_number')
        duration_minutes = data.get('duration_minutes')
        calories_burned = data.get('calories_burned', 0)
        notes = data.get('notes', '')
        exercises = data.get('exercises', [])
        
        if not all([plan_id, session_date, week_number, day_number, duration_minutes]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Log the session
        session_id = workout_tracker.log_workout_session(
            request.user_id, plan_id, session_date, week_number,
            day_number, duration_minutes, calories_burned, notes
        )
        
        # Log individual exercises
        for exercise in exercises:
            workout_tracker.log_exercise_progress(
                session_id,
                exercise.get('exercise_name'),
                exercise.get('sets_completed'),
                exercise.get('reps_completed'),
                exercise.get('weight_used'),
                exercise.get('notes', '')
            )
        
        return jsonify({
            'success': True,
            'session_id': session_id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/plans/<int:plan_id>/progress', methods=['GET'])
@token_required
def get_plan_progress(plan_id):
    """Get detailed progress for a specific plan"""
    try:
        progress = workout_tracker.get_plan_progress(request.user_id, plan_id)
        
        if not progress:
            return jsonify({'error': 'Plan not found'}), 404
        
        return jsonify({
            'success': True,
            'progress': progress
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============= Dashboard & Statistics =============

@app.route('/api/dashboard/stats', methods=['GET'])
@token_required
def get_dashboard_stats():
    """Get comprehensive dashboard statistics"""
    try:
        days = request.args.get('days', 30, type=int)
        stats = workout_tracker.get_user_statistics(request.user_id, days)
        
        return jsonify({
            'success': True,
            'stats': stats
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Initialize all components before starting the server
    initialize_app()
    
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
