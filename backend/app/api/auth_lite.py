from flask import Blueprint, request, jsonify, current_app
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

bp = Blueprint('auth_lite', __name__)


def _serializer():
    secret = current_app.config.get('SECRET_KEY', 'change-me')
    return URLSafeTimedSerializer(secret_key=secret, salt='auth-lite')


@bp.post('/auth/login')
def login():
    payload = request.get_json(silent=True) or {}
    # For demo: accept any username, no password storage
    username = payload.get('username')
    district = payload.get('district')
    if not username:
        return jsonify({'error': 'username required'}), 400
    token = _serializer().dumps({'u': username, 'district': district})
    return jsonify({'token': token})


@bp.get('/auth/me')
def me():
    auth = request.headers.get('Authorization', '')
    parts = auth.split()
    token = parts[-1] if parts else ''
    try:
        data = _serializer().loads(token, max_age=60*60*24*7)
        return jsonify({'username': data.get('u'), 'district': data.get('district')})
    except SignatureExpired:
        return jsonify({'error': 'token expired'}), 401
    except BadSignature:
        return jsonify({'error': 'invalid token'}), 401
