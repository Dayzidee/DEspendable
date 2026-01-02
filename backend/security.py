"""
Security utilities for the banking backend.
Includes CORS management, rate limiting, and security headers.
"""
from functools import wraps
from flask import request, jsonify
from config import get_config
import logging

config = get_config()
logger = logging.getLogger(__name__)

# Note: limiter will be initialized with the app in setup_rate_limiting()
limiter = None


def setup_security_headers(app):
    """Add security headers to all responses"""
    
    @app.after_request
    def add_security_headers(response):
        # Prevent clickjacking
        response.headers['X-Frame-Options'] = 'DENY'
        
        # Prevent MIME sniffing
        response.headers['X-Content-Type-Options'] = 'nosniff'
        
        # Enable XSS protection
        response.headers['X-XSS-Protection'] = '1; mode=block'
        
        # Strict Transport Security (HTTPS only)
        if not config.DEBUG:
            response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        
        # Content Security Policy
        response.headers['Content-Security-Policy'] = "default-src 'self'"
        
        # Referrer Policy
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        return response


def setup_cors(app):
    """Configure CORS with proper restrictions"""
    from flask_cors import CORS
    
    if config.CORS_ENABLED:
        cors_config = config.get_cors_config()
        CORS(app, resources={r"/api/*": cors_config})
        logger.info(f"CORS enabled for origins: {cors_config['origins']}")
    else:
        logger.warning("CORS is disabled")


def setup_rate_limiting(app):
    """Configure rate limiting - currently using no-op implementation"""
    global limiter
    
    # Simple no-op limiter for now
    # TODO: Implement proper rate limiting with Flask-Limiter
    class NoOpLimiter:
        def limit(self, *args, **kwargs):
            """No-op decorator that just returns the function unchanged"""
            def decorator(f):
                return f
            return decorator
    
    limiter = NoOpLimiter()
    logger.info("Rate limiting: Using no-op implementation (development mode)")
    
    return limiter


def handle_rate_limit_error(app):
    """Custom handler for rate limit errors - currently no-op"""
    # Will be implemented when proper rate limiting is added
    pass


def require_auth(f):
    """
    Decorator to require Firebase authentication.
    Use this instead of @check_firebase_auth for consistency.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from auth_middleware import check_firebase_auth
        return check_firebase_auth(f)(*args, **kwargs)
    return decorated_function


def require_admin(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        from flask import g
        from firebase_service import get_db
        
        # First check authentication
        from auth_middleware import check_firebase_auth
        auth_result = check_firebase_auth(lambda: None)()
        if auth_result:  # If auth check returned an error response
            return auth_result
        
        # Check admin status
        db = get_db()
        user_ref = db.collection('users').document(g.user_id).get()
        
        if not user_ref.exists or not user_ref.get('is_admin'):
            logger.warning(f"Unauthorized admin access attempt by user {g.user_id}")
            return jsonify({
                "error": "Nicht autorisiert",
                "message": "Sie haben keine Berechtigung für diese Aktion.",
                "error_code": "UNAUTHORIZED"
            }), 403
        
        return f(*args, **kwargs)
    return decorated_function


def validate_request_data(schema):
    """
    Decorator to validate request data against a Pydantic schema.
    
    Usage:
        @validate_request_data(TransferSchema)
        def transfer_endpoint(validated_data):
            # validated_data is the parsed Pydantic model
            pass
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                data = request.get_json()
                validated = schema(**data)
                return f(validated, *args, **kwargs)
            except Exception as e:
                logger.error(f"Request validation error: {str(e)}")
                return jsonify({
                    "error": "Ungültige Anfrage",
                    "message": str(e),
                    "error_code": "VALIDATION_ERROR"
                }), 400
        return decorated_function
    return decorator


def log_security_event(event_type: str, details: dict):
    """Log security-related events for audit trail"""
    logger.warning(f"SECURITY EVENT: {event_type} | Details: {details}")
    # In production, this should also write to a separate security audit log
    # and potentially trigger alerts for critical events
