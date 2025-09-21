import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_default_secret_key'
    MONGO_URI = os.environ.get('MONGO_URI') or 'mongodb://localhost:27017/student_guidance'
    DEBUG = os.environ.get('DEBUG', 'False') == 'True'
    JSON_SORT_KEYS = False
    # Add any other configuration variables as needed

# You can create different configurations for development, testing, and production if necessary.