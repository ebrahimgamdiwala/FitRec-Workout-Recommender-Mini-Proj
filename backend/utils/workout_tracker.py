import json
from datetime import datetime, timedelta
import sqlite3

class WorkoutTracker:
    """Enhanced workout tracking with detailed progress monitoring"""
    
    def __init__(self, db):
        self.db = db
    
    def save_plan(self, user_id, plan_title, plan_data):
        """Save a workout plan for a user"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO saved_plans 
                (user_id, plan_title, plan_data, started_at, current_week, current_day)
                VALUES (?, ?, ?, ?, 1, 1)
            ''', (user_id, plan_title, json.dumps(plan_data), datetime.now()))
            
            conn.commit()
            plan_id = cursor.lastrowid
            
            return {'plan_id': plan_id, 'message': 'Plan saved successfully'}
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def get_user_plans(self, user_id):
        """Get all saved plans for a user"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                SELECT id, plan_title, plan_data, started_at, completed, 
                       current_week, current_day
                FROM saved_plans
                WHERE user_id = ?
                ORDER BY started_at DESC
            ''', (user_id,))
            
            plans = []
            for row in cursor.fetchall():
                plan_dict = dict(row)
                plan_dict['plan_data'] = json.loads(plan_dict['plan_data'])
                plans.append(plan_dict)
            
            return plans
        finally:
            conn.close()
    
    def log_workout_session(self, user_id, plan_id, session_date, week_number, 
                           day_number, duration_minutes, calories_burned, notes=''):
        """Log a completed workout session"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO workout_sessions 
                (user_id, plan_id, session_date, week_number, day_number, 
                 duration_minutes, calories_burned, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (user_id, plan_id, session_date, week_number, day_number,
                  duration_minutes, calories_burned, notes))
            
            conn.commit()
            session_id = cursor.lastrowid
            
            # Update plan progress
            cursor.execute('''
                UPDATE saved_plans 
                SET current_week = ?, current_day = ?
                WHERE id = ?
            ''', (week_number, day_number, plan_id))
            conn.commit()
            
            return session_id
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def log_exercise_progress(self, session_id, exercise_name, sets_completed, 
                             reps_completed, weight_used=None, notes=''):
        """Log individual exercise completion"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO exercise_progress 
                (session_id, exercise_name, sets_completed, reps_completed, 
                 weight_used, notes)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (session_id, exercise_name, sets_completed, reps_completed,
                  weight_used, notes))
            
            conn.commit()
            return cursor.lastrowid
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def get_user_statistics(self, user_id, days=30):
        """Get comprehensive user workout statistics"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)
            
            # Total workouts
            cursor.execute('''
                SELECT COUNT(*) as total_workouts,
                       SUM(duration_minutes) as total_minutes,
                       SUM(calories_burned) as total_calories,
                       AVG(duration_minutes) as avg_duration
                FROM workout_sessions
                WHERE user_id = ? AND session_date >= ?
            ''', (user_id, start_date.date()))
            stats = dict(cursor.fetchone())
            
            # Workouts by day of week
            cursor.execute('''
                SELECT strftime('%w', session_date) as day_of_week,
                       COUNT(*) as count
                FROM workout_sessions
                WHERE user_id = ? AND session_date >= ?
                GROUP BY day_of_week
                ORDER BY count DESC
            ''', (user_id, start_date.date()))
            
            day_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
                        'Thursday', 'Friday', 'Saturday']
            workouts_by_day = {}
            for row in cursor.fetchall():
                day_idx = int(row['day_of_week'])
                workouts_by_day[day_names[day_idx]] = row['count']
            
            # Most active day
            most_active_day = max(workouts_by_day.items(), 
                                 key=lambda x: x[1])[0] if workouts_by_day else None
            
            # Workout categories (from saved plans)
            cursor.execute('''
                SELECT sp.plan_data, COUNT(ws.id) as workout_count
                FROM saved_plans sp
                LEFT JOIN workout_sessions ws ON sp.id = ws.plan_id
                WHERE sp.user_id = ? AND ws.session_date >= ?
                GROUP BY sp.id
            ''', (user_id, start_date.date()))
            
            categories = {}
            for row in cursor.fetchall():
                plan_data = json.loads(row['plan_data'])
                goal = plan_data.get('goal', 'Unknown')
                categories[goal] = categories.get(goal, 0) + row['workout_count']
            
            # Recent workout history (last 7 days)
            cursor.execute('''
                SELECT session_date, duration_minutes, calories_burned
                FROM workout_sessions
                WHERE user_id = ? AND session_date >= ?
                ORDER BY session_date DESC
                LIMIT 7
            ''', (user_id, (end_date - timedelta(days=7)).date()))
            
            recent_workouts = [dict(row) for row in cursor.fetchall()]
            
            # Current streak
            cursor.execute('''
                SELECT session_date
                FROM workout_sessions
                WHERE user_id = ?
                ORDER BY session_date DESC
            ''', (user_id,))
            
            dates = [row['session_date'] for row in cursor.fetchall()]
            streak = self._calculate_streak(dates)
            
            return {
                'total_workouts': stats['total_workouts'] or 0,
                'total_minutes': stats['total_minutes'] or 0,
                'total_calories': stats['total_calories'] or 0,
                'avg_duration': round(stats['avg_duration'] or 0, 1),
                'workouts_by_day': workouts_by_day,
                'most_active_day': most_active_day,
                'categories': categories,
                'recent_workouts': recent_workouts,
                'current_streak': streak,
                'period_days': days
            }
        finally:
            conn.close()
    
    def _calculate_streak(self, dates):
        """Calculate current workout streak"""
        if not dates:
            return 0
        
        dates = [datetime.strptime(d, '%Y-%m-%d').date() if isinstance(d, str) else d 
                for d in dates]
        dates.sort(reverse=True)
        
        streak = 0
        expected_date = datetime.now().date()
        
        for date in dates:
            if date == expected_date or date == expected_date - timedelta(days=1):
                streak += 1
                expected_date = date - timedelta(days=1)
            else:
                break
        
        return streak
    
    def get_plan_progress(self, user_id, plan_id):
        """Get detailed progress for a specific plan"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            # Get plan details
            cursor.execute('''
                SELECT plan_title, plan_data, current_week, current_day, started_at
                FROM saved_plans
                WHERE id = ? AND user_id = ?
            ''', (plan_id, user_id))
            
            plan = cursor.fetchone()
            if not plan:
                return None
            
            plan_dict = dict(plan)
            plan_dict['plan_data'] = json.loads(plan_dict['plan_data'])
            
            # Get all sessions for this plan
            cursor.execute('''
                SELECT ws.*, 
                       (SELECT COUNT(*) FROM exercise_progress ep 
                        WHERE ep.session_id = ws.id) as exercises_logged
                FROM workout_sessions ws
                WHERE ws.plan_id = ? AND ws.user_id = ?
                ORDER BY ws.session_date DESC
            ''', (plan_id, user_id))
            
            sessions = [dict(row) for row in cursor.fetchall()]
            
            # Get exercise details for each session
            for session in sessions:
                cursor.execute('''
                    SELECT exercise_name, sets_completed, reps_completed, 
                           weight_used, notes
                    FROM exercise_progress
                    WHERE session_id = ?
                ''', (session['id'],))
                session['exercises'] = [dict(row) for row in cursor.fetchall()]
            
            plan_dict['sessions'] = sessions
            plan_dict['total_sessions'] = len(sessions)
            
            return plan_dict
        finally:
            conn.close()
    
    def complete_plan(self, user_id, plan_id):
        """Mark a plan as completed"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                UPDATE saved_plans
                SET completed = 1
                WHERE id = ? AND user_id = ?
            ''', (plan_id, user_id))
            conn.commit()
            return True
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
