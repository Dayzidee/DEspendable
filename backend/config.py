"""
Centralized configuration management for the banking backend.
Loads configuration from environment variables with sensible defaults.
"""
import os
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration class"""
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'
    
    # Frontend Configuration
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
    
    # Firebase Configuration
    FIREBASE_SERVICE_ACCOUNT_PATH = os.getenv(
        'FIREBASE_SERVICE_ACCOUNT_PATH', 
        './serviceAccountKey.json'
    )
    
    # Server Configuration
    PORT = int(os.getenv('PORT', 5000))
    HOST = os.getenv('HOST', '0.0.0.0')
    
    # Rate Limiting
    RATE_LIMIT_ENABLED = os.getenv('RATE_LIMIT_ENABLED', 'true').lower() == 'true'
    RATE_LIMIT_PER_MINUTE = int(os.getenv('RATE_LIMIT_PER_MINUTE', 60))
    
    # TAN Configuration
    TAN_EXPIRATION_MINUTES = int(os.getenv('TAN_EXPIRATION_MINUTES', 5))
    TAN_LENGTH = int(os.getenv('TAN_LENGTH', 6))
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'server.log')
    
    # Security
    CORS_ENABLED = os.getenv('CORS_ENABLED', 'true').lower() == 'true'
    SECURE_COOKIES = os.getenv('SECURE_COOKIES', 'false').lower() == 'true'
    
    # Feature Flags
    ENABLE_MULTIBANKING = os.getenv('ENABLE_MULTIBANKING', 'false').lower() == 'true'
    ENABLE_PHOTO_TRANSFER = os.getenv('ENABLE_PHOTO_TRANSFER', 'true').lower() == 'true'
    ENABLE_ADMIN_PANEL = os.getenv('ENABLE_ADMIN_PANEL', 'true').lower() == 'true'
    
    @classmethod
    def validate(cls):
        """Validate critical configuration"""
        if cls.SECRET_KEY == 'dev-secret-key-change-in-production' and not cls.DEBUG:
            raise ValueError("SECRET_KEY must be changed in production!")
        
        if not os.path.exists(cls.FIREBASE_SERVICE_ACCOUNT_PATH):
            raise FileNotFoundError(
                f"Firebase service account key not found at: {cls.FIREBASE_SERVICE_ACCOUNT_PATH}"
            )
    
    @classmethod
    def get_cors_config(cls) -> dict:
        """Get CORS configuration"""
        if not cls.CORS_ENABLED:
            return {}
        
        return {
            "origins": cls.ALLOWED_ORIGINS,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "max_age": 3600
        }


class ProductionConfig(Config):
    """Production-specific configuration"""
    DEBUG = False
    SECURE_COOKIES = True
    RATE_LIMIT_PER_MINUTE = 30  # Stricter in production


class DevelopmentConfig(Config):
    """Development-specific configuration"""
    DEBUG = True
    RATE_LIMIT_ENABLED = False  # Disable for easier testing


class TestingConfig(Config):
    """Testing-specific configuration"""
    TESTING = True
    RATE_LIMIT_ENABLED = False


# Configuration dictionary
config_by_name = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config() -> Config:
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    config_class = config_by_name.get(env, DevelopmentConfig)
    config_class.validate()
    return config_class
