from datetime import datetime, timedelta
import jwt
from flask import current_app

def encode_token(user_id):
    try:
        payload = {
            'sub': user_id,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(days=1)  # Token expires in 1 day
        }
        return jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    except Exception as e:
        return str(e)

def decode_token(token):
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Token expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'