import sqlite3
import os
from datetime import datetime
import json

class Database:
    """Database handler for user authentication and workout tracking"""
    
    def __init__(self, db_path=None):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.db_path = db_path or os.path.join(base_dir, 'models', 'workout_tracker.db')
        self.init_database()
    
    def get_connection(self):
        """Get database connection"""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_database(self):
        """Initialize database tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        ''')
        
        # Saved workout plans
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS saved_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                plan_title TEXT NOT NULL,
                plan_data TEXT NOT NULL,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed BOOLEAN DEFAULT 0,
                current_week INTEGER DEFAULT 1,
                current_day INTEGER DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, plan_title)
            )
        ''')
        
        # Daily workout sessions
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS workout_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                plan_id INTEGER NOT NULL,
                session_date DATE NOT NULL,
                week_number INTEGER,
                day_number INTEGER,
                duration_minutes INTEGER,
                calories_burned INTEGER,
                notes TEXT,
                completed BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (plan_id) REFERENCES saved_plans(id)
            )
        ''')
        
        # Exercise completion tracking
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS exercise_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id INTEGER NOT NULL,
                exercise_name TEXT NOT NULL,
                sets_completed INTEGER,
                reps_completed TEXT,
                weight_used REAL,
                completed BOOLEAN DEFAULT 1,
                notes TEXT,
                FOREIGN KEY (session_id) REFERENCES workout_sessions(id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print("Database initialized successfully!")
