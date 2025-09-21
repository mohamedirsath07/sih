from flask import Blueprint, request, jsonify
from app.utils.jwt import generate_token, decode_token
from app.models.user import User
from app.utils.validators import validate_user_registration, validate_user_login

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not validate_user_registration(data):
        return jsonify({'message': 'Invalid data'}), 400

    user = User(username=data['username'], password=data['password'])
    user.save()
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not validate_user_login(data):
        return jsonify({'message': 'Invalid credentials'}), 401

    user = User.query.filter_by(username=data['username']).first()
    if user and user.verify_password(data['password']):
        token = generate_token(user.id)
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/profile', methods=['GET'])
def profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401

    user_id = decode_token(token)
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({'username': user.username}), 200