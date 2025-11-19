"""
Verify that all backend dependencies are correctly installed
"""

import sys

def check_package(package_name, import_name=None, required_attrs=None):
    """Check if a package is installed and has required attributes"""
    if import_name is None:
        import_name = package_name
    
    try:
        module = __import__(import_name)
        version = getattr(module, '__version__', 'unknown')
        print(f"✓ {package_name:20s} {version}")
        
        if required_attrs:
            for attr in required_attrs:
                if not hasattr(module, attr):
                    print(f"  ✗ Missing attribute: {attr}")
                    return False
        return True
    except ImportError as e:
        print(f"✗ {package_name:20s} NOT INSTALLED")
        return False

def main():
    print("=" * 60)
    print("FitRec Backend Dependency Verification")
    print("=" * 60)
    print()
    
    all_ok = True
    
    # Core dependencies
    print("Core Dependencies:")
    all_ok &= check_package("Flask", "flask")
    all_ok &= check_package("Flask-CORS", "flask_cors")
    all_ok &= check_package("pandas")
    all_ok &= check_package("numpy")
    all_ok &= check_package("scikit-learn", "sklearn")
    print()
    
    # Authentication
    print("Authentication:")
    all_ok &= check_package("PyJWT", "jwt", required_attrs=['encode', 'decode'])
    all_ok &= check_package("bcrypt")
    print()
    
    # ML dependencies
    print("Machine Learning:")
    all_ok &= check_package("sentence-transformers", "sentence_transformers")
    all_ok &= check_package("torch")
    all_ok &= check_package("joblib")
    print()
    
    # Test JWT functionality
    print("Testing JWT functionality:")
    try:
        import jwt
        test_payload = {'user_id': 1, 'email': 'test@example.com'}
        token = jwt.encode(test_payload, 'test-secret', algorithm='HS256')
        decoded = jwt.decode(token, 'test-secret', algorithms=['HS256'])
        print(f"✓ JWT encode/decode working")
        print(f"  Token sample: {token[:50]}...")
    except Exception as e:
        print(f"✗ JWT test failed: {e}")
        all_ok = False
    print()
    
    # Test bcrypt functionality
    print("Testing bcrypt functionality:")
    try:
        import bcrypt
        password = b"test_password"
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())
        verified = bcrypt.checkpw(password, hashed)
        print(f"✓ bcrypt hash/verify working")
    except Exception as e:
        print(f"✗ bcrypt test failed: {e}")
        all_ok = False
    print()
    
    # Check database module
    print("Custom Modules:")
    try:
        from models.database import Database
        print(f"✓ Database module")
    except Exception as e:
        print(f"✗ Database module: {e}")
        all_ok = False
    
    try:
        from utils.auth import AuthManager
        print(f"✓ AuthManager module")
    except Exception as e:
        print(f"✗ AuthManager module: {e}")
        all_ok = False
    
    try:
        from utils.recommender import WorkoutRecommender
        print(f"✓ WorkoutRecommender module")
    except Exception as e:
        print(f"✗ WorkoutRecommender module: {e}")
        all_ok = False
    
    try:
        from utils.workout_tracker import WorkoutTracker
        print(f"✓ WorkoutTracker module")
    except Exception as e:
        print(f"✗ WorkoutTracker module: {e}")
        all_ok = False
    print()
    
    # Final result
    print("=" * 60)
    if all_ok:
        print("✅ All dependencies are correctly installed!")
        print()
        print("You can now run: python app.py")
    else:
        print("❌ Some dependencies are missing or incorrectly installed")
        print()
        print("To fix:")
        print("1. Run: python fix_jwt.py")
        print("2. Or run: pip install -r requirements.txt --force-reinstall")
    print("=" * 60)
    
    return 0 if all_ok else 1

if __name__ == "__main__":
    sys.exit(main())
