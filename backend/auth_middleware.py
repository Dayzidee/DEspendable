from functools import wraps
from flask import request, jsonify, g
from firebase_admin import auth

def check_firebase_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Missing Authorization Header'}), 401
        
        try:
            # Header format: "Bearer <token>"
            token = auth_header.split(" ")[1]
            decoded_token = auth.verify_id_token(token)
            g.user_id = decoded_token['uid']
            g.user_email = decoded_token.get('email')
        except IndexError:
            return jsonify({'message': 'Invalid Authorization Header format'}), 401
        except auth.InvalidIdTokenError:
            return jsonify({'message': 'Invalid ID Token'}), 401
        except Exception as e:
            return jsonify({'message': f'Authentication Error: {str(e)}'}), 401

        return f(*args, **kwargs)
    return decorated_function
