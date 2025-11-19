import jwt as pyjwt
import bcrypt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
import os

SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

class AuthManager:
    """Handle authentication operations"""
    
    def __init__(self, db):
        self.db = db
    
    def hash_password(self, password):
        """Hash a password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password, password_hash):
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
    
    def generate_token(self, user_id, email):
        """Generate JWT token"""
        payload = {
            'user_id': user_id,
            'email': email,
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
            'iat': datetime.utcnow()
        }
        return pyjwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
    
    def verify_token(self, token):
        """Verify JWT token and return payload"""
        try:
            payload = pyjwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return payload
        except pyjwt.ExpiredSignatureError:
            return None
        except pyjwt.InvalidTokenError:
            return None
    
    def register_user(self, email, password, name):
        """Register a new user"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            # Check if user exists
            cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
            if cursor.fetchone():
                return None, "Email already registered"
            
            # Hash password and create user
            password_hash = self.hash_password(password)
            cursor.execute(
                'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
                (email, password_hash, name)
            )
            conn.commit()
            user_id = cursor.lastrowid
            
            # Generate token
            token = self.generate_token(user_id, email)
            
            return {
                'user_id': user_id,
                'email': email,
                'name': name,
                'token': token
            }, None
            
        except Exception as e:
            conn.rollback()
            return None, str(e)
        finally:
            conn.close()
    
    def login_user(self, email, password):
        """Login user and return token"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT id, email, password_hash, name FROM users WHERE email = ?', (email,))
            user = cursor.fetchone()
            
            if not user:
                return None, "Invalid email or password"
            
            if not self.verify_password(password, user['password_hash']):
                return None, "Invalid email or password"
            
            # Update last login
            cursor.execute('UPDATE users SET last_login = ? WHERE id = ?', 
                         (datetime.now(), user['id']))
            conn.commit()
            
            # Generate token
            token = self.generate_token(user['id'], user['email'])
            
            return {
                'user_id': user['id'],
                'email': user['email'],
                'name': user['name'],
                'token': token
            }, None
            
        except Exception as e:
            return None, str(e)
        finally:
            conn.close()
    
    def get_user_by_id(self, user_id):
        """Get user information by ID"""
        conn = self.db.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('SELECT id, email, name, created_at FROM users WHERE id = ?', (user_id,))
            user = cursor.fetchone()
            if user:
                return dict(user)
            return None
        finally:
            conn.close()

def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Get token from header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            payload = pyjwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
            request.user_id = payload['user_id']
            request.user_email = payload['email']
        except pyjwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except pyjwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    
    return decorated
