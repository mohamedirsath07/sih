from flask import Blueprint, request, jsonify
from app.models.user import User
from app.utils.jwt import generate_token, decode_token
from app.utils.validators import validate_user_data

users_bp = Blueprint('users', __name__)

@users_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if not validate_user_data(data):
        return jsonify({"message": "Invalid user data"}), 400

    new_user = User(**data)
    new_user.save()
    return jsonify({"message": "User registered successfully"}), 201

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.verify_password(data['password']):
        token = generate_token(user.id)
        return jsonify({"token": token}), 200
    
    return jsonify({"message": "Invalid credentials"}), 401

@users_bp.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization').split(" ")[1]
    user_id = decode_token(token)
    
    user = User.query.get(user_id)
    if user:
        return jsonify({"email": user.email, "name": user.name}), 200
    
    return jsonify({"message": "User not found"}), 404

@users_bp.route('/update', methods=['PUT'])
def update_profile():
    token = request.headers.get('Authorization').split(" ")[1]
    user_id = decode_token(token)
    
    data = request.json
    user = User.query.get(user_id)
    
    if user:
        user.update(**data)
        return jsonify({"message": "Profile updated successfully"}), 200
    
    return jsonify({"message": "User not found"}), 404