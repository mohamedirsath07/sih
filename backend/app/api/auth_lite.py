from flask import Blueprint, request, jsonify, current_app
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
import hashlib
import json
import os

bp = Blueprint('auth_lite', __name__)

# Simple file-based storage for demo purposes
USERS_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'users.json')

def _serializer():
    secret = current_app.config.get('SECRET_KEY', 'change-me')
    return URLSafeTimedSerializer(secret_key=secret, salt='auth-lite')

def _load_users():
    """Load users from JSON file"""
    try:
        if os.path.exists(USERS_FILE):
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
    except:
        pass
    return {}

def _save_users(users):
    """Save users to JSON file"""
    try:
        os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f, indent=2)
    except Exception as e:
        print(f"Error saving users: {e}")

def _hash_password(password):
    """Simple password hashing"""
    return hashlib.sha256(password.encode()).hexdigest()

@bp.post('/auth/register')
def register():
    payload = request.get_json(silent=True) or {}
    email = payload.get('email')
    password = payload.get('password')
    name = payload.get('name')
    
    if not email or not password or not name:
        return jsonify({'error': 'email, password, and name are required'}), 400
    
    users = _load_users()
    
    if email in users:
        return jsonify({'error': 'User already exists'}), 400
    
    # Store user data
    users[email] = {
        'email': email,
        'password': _hash_password(password),
        'name': name,
        'phone': '',
        'age': None,
        'gender': '',
        'class': '',
        'board': '',
        'stream': ''
    }
    
    _save_users(users)
    return jsonify({'message': 'User registered successfully'}), 201

@bp.post('/auth/login')
def login():
    payload = request.get_json(silent=True) or {}
    
    # Support both old username/district format and new email/password format
    email = payload.get('email')
    password = payload.get('password')
    username = payload.get('username')  # Legacy support
    district = payload.get('district')  # Legacy support
    
    if email and password:
        # New email/password authentication
        users = _load_users()
        user = users.get(email)
        
        if not user or user['password'] != _hash_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
            
        token = _serializer().dumps({'email': email})
        return jsonify({'token': token})
    
    elif username:
        # Legacy username authentication
        token = _serializer().dumps({'u': username, 'district': district})
        return jsonify({'token': token})
    
    return jsonify({'error': 'email/password or username required'}), 400

@bp.get('/auth/me')
def me():
    auth = request.headers.get('Authorization', '')
    parts = auth.split()
    token = parts[-1] if parts else ''
    
    try:
        data = _serializer().loads(token, max_age=60*60*24*7)
        
        # Handle new email-based tokens
        if 'email' in data:
            users = _load_users()
            user = users.get(data['email'])
            if user:
                # Remove password from response
                user_data = user.copy()
                user_data.pop('password', None)
                return jsonify(user_data)
            return jsonify({'error': 'User not found'}), 404
        
        # Handle legacy username tokens
        return jsonify({'username': data.get('u'), 'district': data.get('district')})
        
    except SignatureExpired:
        return jsonify({'error': 'token expired'}), 401
    except BadSignature:
        return jsonify({'error': 'invalid token'}), 401

@bp.put('/auth/profile')
def update_profile():
    auth = request.headers.get('Authorization', '')
    parts = auth.split()
    token = parts[-1] if parts else ''
    
    try:
        data = _serializer().loads(token, max_age=60*60*24*7)
        
        if 'email' not in data:
            return jsonify({'error': 'Invalid token format'}), 401
            
        email = data['email']
        users = _load_users()
        
        if email not in users:
            return jsonify({'error': 'User not found'}), 404
        
        payload = request.get_json(silent=True) or {}
        
        # Update allowed fields
        allowed_fields = ['name', 'phone', 'age', 'gender', 'class', 'board', 'stream']
        for field in allowed_fields:
            if field in payload:
                users[email][field] = payload[field]
        
        # Convert age to int if provided
        if 'age' in payload and payload['age']:
            try:
                users[email]['age'] = int(payload['age'])
            except ValueError:
                users[email]['age'] = None
        
        _save_users(users)
        
        # Return updated user data (without password)
        user_data = users[email].copy()
        user_data.pop('password', None)
        return jsonify(user_data)
        
    except SignatureExpired:
        return jsonify({'error': 'token expired'}), 401
    except BadSignature:
        return jsonify({'error': 'invalid token'}), 401
