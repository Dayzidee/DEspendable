import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase Admin SDK
# For local development, we expect a serviceAccountKey.json file.
# In production, this can often pick up environment credentials automatically.

cred = None
if os.path.exists('serviceAccountKey.json'):
    cred = credentials.Certificate('serviceAccountKey.json')
else:
    # Use default credentials (Google Application Credentials)
    # This works if GOOGLE_APPLICATION_CREDENTIALS env var is set
    print("Warning: serviceAccountKey.json not found. Attempting to use default credentials.")
    cred = credentials.ApplicationDefault()

try:
    firebase_admin.initialize_app(cred)
    print("Firebase Admin Initialized successfully.")
except ValueError:
    # App already initialized
    pass

db = firestore.client()

def get_db():
    return db
