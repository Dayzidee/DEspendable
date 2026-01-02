from flask import Flask, request, jsonify, g
from flask_socketio import SocketIO, join_room, emit
from firebase_service import get_db
from auth_middleware import check_firebase_auth
from firebase_admin import auth, firestore
from datetime import datetime
import os
import uuid
import logging

# Import configuration and security modules
from config import get_config
from security import setup_security_headers, setup_cors, handle_rate_limit_error

# Initialize configuration
config = get_config()

# Setup logging
logging.basicConfig(
    level=getattr(logging, config.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(config.LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY

# Setup security
setup_cors(app)
setup_security_headers(app)
handle_rate_limit_error(app)

# Setup rate limiting and get limiter instance
from security import setup_rate_limiting
limiter = setup_rate_limiting(app)

# Initialize SocketIO with proper CORS
socketio = SocketIO(
    app, 
    cors_allowed_origins=config.ALLOWED_ORIGINS,
    async_mode='threading'
)
db = get_db()

# --- CONSTANTS ---
ACCOUNT_TYPES = ["Checking", "Savings", "Investment"]

# --- ERROR HANDLERS ---

@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        "error": "Ungültige Anfrage",
        "message": str(error),
        "error_code": "BAD_REQUEST"
    }), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({
        "error": "Nicht authentifiziert",
        "message": "Bitte melden Sie sich an.",
        "error_code": "UNAUTHORIZED"
    }), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({
        "error": "Zugriff verweigert",
        "message": "Sie haben keine Berechtigung für diese Aktion.",
        "error_code": "FORBIDDEN"
    }), 403

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        "error": "Nicht gefunden",
        "message": "Die angeforderte Ressource wurde nicht gefunden.",
        "error_code": "NOT_FOUND"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        "error": "Serverfehler",
        "message": "Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.",
        "error_code": "INTERNAL_ERROR"
    }), 500

# --- API ROUTES ---

@app.route('/api/health')
@limiter.limit("10/minute")
def health_check():
    """Health check endpoint with rate limiting"""
    return jsonify({
        "status": "ok", 
        "backend": "Firebase+Flask",
        "version": "2.0.0",
        "environment": config.FLASK_ENV
    }), 200

@app.route('/api/signup', methods=['POST'])
def signup_webhook():
    """
    Called by Frontend (or via Firebase Auth trigger if configured) to sync user data to Firestore.
    Frontend creates user in Firebase Auth, then calls this to create the User Document.
    """
    data = request.json
    uid = data.get('uid')
    email = data.get('email')
    username = data.get('username')

    if not uid or not username:
        return jsonify({"error": "Missing UID or Username"}), 400

    # Create User Document
    user_ref = db.collection('users').document(uid)
    if user_ref.get().exists:
        return jsonify({"error": "User already exists"}), 409

    # Generate Account Number
    # Simple random generation for now
    import random
    account_number = ''.join([str(random.randint(0, 9)) for _ in range(10)])

    user_data = {
        'username': username,
        'email': email,
        'account_number': account_number,
        'account_tier': 'standard',
        'is_admin': False,
        'created_at': firestore.SERVER_TIMESTAMP,
        '_is_active': True
    }
    user_ref.set(user_data)

    # Create Initial Accounts
    batch = db.batch()
    accounts_ref = db.collection('accounts')
    
    for acc_type in ['Checking', 'Savings']:
        new_acc_ref = accounts_ref.document()
        batch.set(new_acc_ref, {
            'owner_uid': uid,
            'type': acc_type,
            'balance': 0.00,
            'created_at': firestore.SERVER_TIMESTAMP
        })
    
    batch.commit()

    return jsonify({"success": True, "message": "User initialized"}), 201

@app.route('/api/dashboard', methods=['GET'])
@check_firebase_auth
def get_dashboard_data():
    uid = g.user_id
    
    # Fetch Accounts
    accounts = []
    total_balance = 0.0
    docs = db.collection('accounts').where('owner_uid', '==', uid).stream()
    
    for doc in docs:
        acc = doc.to_dict()
        acc['id'] = doc.id
        # Convert float to nice string or keep distinct for frontend
        accounts.append(acc)
        total_balance += float(acc.get('balance', 0))

    # Fetch Recent Transactions
    transactions = []
    # Queries in NoSQL can be tricky with complex sorting/filtering without composite indexes.
    # We'll do a simple fetch for now.
    txn_docs = db.collection('transactions').where('owner_uid', '==', uid)\
                 .order_by('timestamp', direction=firestore.Query.DESCENDING).limit(10).stream()
    
    for doc in txn_docs:
        t = doc.to_dict()
        t['id'] = doc.id
        transactions.append(t)

    return jsonify({
        "accounts": accounts,
        "total_balance": total_balance,
        "recent_transactions": transactions
    })

@app.route('/api/transfer/initiate', methods=['POST'])
@check_firebase_auth
@limiter.limit("10/minute")
def initiate_transfer():
    """
    Initiate a transfer and create TAN challenge.
    Uses dynamic linking to bind TAN to transaction details.
    """
    uid = g.user_id
    data = request.json
    
    from_account_id = data.get('from_account_id')
    amount = float(data.get('amount', 0))
    reference = data.get('reference', 'Transfer')
    transfer_type = data.get('type', 'internal')  # internal or external
    
    if amount <= 0:
        return jsonify({"error": "Ungültiger Betrag"}), 400

    # 1. Validate Source Account & Balance
    acc_ref = db.collection('accounts').document(from_account_id)
    acc_snap = acc_ref.get()
    
    if not acc_snap.exists or acc_snap.get('owner_uid') != uid:
         return jsonify({"error": "Ungültiges Quellkonto"}), 403
         
    if float(acc_snap.get('balance')) < amount:
         return jsonify({"error": "Unzureichendes Guthaben"}), 400

    # 2. Determine recipient
    recipient_identifier = ""
    recipient_info = {}
    
    if transfer_type == 'internal':
        to_account_id = data.get('to_account_id')
        recipient_identifier = to_account_id
        recipient_info = {'to_account_id': to_account_id}
    elif transfer_type == 'external':
        recipient_account_number = data.get('recipient_account_number')
        recipient_identifier = recipient_account_number
        recipient_info = {'recipient_account_number': recipient_account_number}
    else:
        return jsonify({"error": "Ungültiger Transfertyp"}), 400

    # 3. Create Pending Transaction
    tx_data = {
        'owner_uid': uid,
        'from_account_id': from_account_id,
        'amount': amount,
        'reference': reference,
        'recipient_info': recipient_info,
        'type': transfer_type,
        'status': 'pending_sca',
        'created_at': firestore.SERVER_TIMESTAMP
    }
    
    tx_ref = db.collection('transactions').add(tx_data)
    transaction_id = tx_ref[1].id
    
    # 4. Create TAN Challenge with Dynamic Linking
    from tan_service import TANService
    
    try:
        tan_id, challenge_data = TANService.create_tan_challenge(
            user_id=uid,
            transaction_id=transaction_id,
            amount=amount,
            recipient=recipient_identifier,
            tan_type='pushTAN'
        )
        
        logger.info(f"Transfer initiated: {transaction_id}, TAN challenge: {tan_id}")
        
        return jsonify({
            "status": "sca_required",
            "transaction_id": transaction_id,
            "tan_id": tan_id,
            "challenge": challenge_data
        }), 200
        
    except Exception as e:
        logger.error(f"Error creating TAN challenge: {str(e)}")
        # Cleanup transaction
        db.collection('transactions').document(transaction_id).delete()
        return jsonify({"error": "Fehler bei der TAN-Generierung"}), 500

@app.route('/api/transfer/confirm', methods=['POST'])
@check_firebase_auth
@limiter.limit("5/minute")
def confirm_transfer():
    """
    Confirm transfer with TAN validation.
    Validates TAN with dynamic linking and executes transfer atomically.
    """
    uid = g.user_id
    data = request.json
    
    transaction_id = data.get('transaction_id')
    tan_id = data.get('tan_id')
    tan_input = data.get('tan')
    
    if not all([transaction_id, tan_id, tan_input]):
        return jsonify({"error": "Fehlende Parameter"}), 400
    
    # 1. Get Transaction
    tx_ref = db.collection('transactions').document(transaction_id)
    tx_snap = tx_ref.get()
    
    if not tx_snap.exists:
        return jsonify({"error": "Transaktion nicht gefunden"}), 404
        
    tx_data = tx_snap.to_dict()
    
    if tx_data.get('owner_uid') != uid:
        return jsonify({"error": "Nicht autorisiert"}), 403
        
    if tx_data.get('status') != 'pending_sca':
        return jsonify({"error": "Transaktion bereits verarbeitet oder ungültig"}), 400
    
    # 2. Validate TAN with Dynamic Linking
    from tan_service import TANService
    
    # Determine recipient identifier
    recipient_info = tx_data.get('recipient_info', {})
    recipient = recipient_info.get('to_account_id') or recipient_info.get('recipient_account_number')
    
    is_valid, error_msg = TANService.validate_tan(
        tan_id=tan_id,
        tan_input=tan_input,
        transaction_id=transaction_id,
        amount=tx_data.get('amount'),
        recipient=recipient
    )
    
    if not is_valid:
        logger.warning(f"TAN validation failed for transaction {transaction_id}: {error_msg}")
        return jsonify({"error": error_msg}), 400

    # 3. Execute Transaction Atomically
    transaction = db.transaction()
    
    @firestore.transactional
    def execute_transfer_tx(transaction, tx_ref, tx_data, uid):
        # Re-read source balance
        from_acc_ref = db.collection('accounts').document(tx_data['from_account_id'])
        snapshot = from_acc_ref.get(transaction=transaction)
        
        current_balance = float(snapshot.get('balance'))
        amount = float(tx_data['amount'])
        
        if current_balance < amount:
            raise Exception("Unzureichendes Guthaben (Saldo hat sich geändert)")
            
        # Deduct from sender
        transaction.update(from_acc_ref, {'balance': current_balance - amount})
        
        # Credit recipient
        data_type = tx_data['type']
        rec_info = tx_data['recipient_info']
        
        if data_type == 'internal':
            to_acc_ref = db.collection('accounts').document(rec_info['to_account_id'])
            to_snap = to_acc_ref.get(transaction=transaction)
            if to_snap.exists:
                 transaction.update(to_acc_ref, {'balance': float(to_snap.get('balance')) + amount})
                 
        elif data_type == 'external':
             # External transfer: lookup recipient by account number
             rec_acc_num = rec_info['recipient_account_number']
             
             # Find recipient user by account number
             users_query = db.collection('users').where('account_number', '==', rec_acc_num).limit(1).stream()
             recipient_user = None
             for user_doc in users_query:
                 recipient_user = user_doc
                 break
             
             if recipient_user:
                 # Find recipient's checking account
                 recipient_accounts = db.collection('accounts')\
                     .where('owner_uid', '==', recipient_user.id)\
                     .where('type', '==', 'Checking')\
                     .limit(1).stream()
                 
                 for rec_acc in recipient_accounts:
                     rec_acc_ref = db.collection('accounts').document(rec_acc.id)
                     rec_snap = rec_acc_ref.get(transaction=transaction)
                     if rec_snap.exists:
                         transaction.update(rec_acc_ref, {'balance': float(rec_snap.get('balance')) + amount})
                     break

        # Update Transaction Status
        transaction.update(tx_ref, {
            'status': 'completed',
            'completed_at': firestore.SERVER_TIMESTAMP,
            'notes': tx_data.get('reference')
        })

    try:
        execute_transfer_tx(transaction, tx_ref, tx_data, uid)
        logger.info(f"Transfer completed successfully: {transaction_id}")
        return jsonify({
            "success": True, 
            "message": "Überweisung erfolgreich ausgeführt"
        }), 200
    except Exception as e:
        logger.error(f"Transfer execution failed: {str(e)}")
        return jsonify({"error": str(e)}), 400

# --- STANDING ORDERS ROUTES ---

@app.route('/api/standing-orders', methods=['GET'])
@check_firebase_auth
def get_standing_orders():
    """Get all standing orders for the authenticated user"""
    from standing_orders_service import StandingOrderService
    
    uid = g.user_id
    orders = StandingOrderService.get_user_standing_orders(uid)
    
    return jsonify(orders), 200


@app.route('/api/standing-orders', methods=['POST'])
@check_firebase_auth
def create_standing_order():
    """Create a new standing order"""
    from standing_orders_service import StandingOrderService
    
    uid = g.user_id
    data = request.json
    
    # Parse dates
    from datetime import datetime
    start_date = datetime.fromisoformat(data.get('start_date').replace('Z', '+00:00'))
    end_date = None
    if data.get('end_date'):
        end_date = datetime.fromisoformat(data.get('end_date').replace('Z', '+00:00'))
    
    success, message, order_id = StandingOrderService.create_standing_order(
        user_id=uid,
        from_account_id=data.get('from_account_id'),
        to_account_id=data.get('to_account_id'),
        amount=float(data.get('amount')),
        reference=data.get('reference', ''),
        frequency=data.get('frequency', 'monthly'),
        start_date=start_date,
        end_date=end_date,
        execution_day=int(data.get('execution_day', 1))
    )
    
    if success:
        return jsonify({
            "success": True,
            "message": message,
            "standing_order_id": order_id
        }), 201
    else:
        return jsonify({"error": message}), 400


@app.route('/api/standing-orders/<order_id>', methods=['DELETE'])
@check_firebase_auth
def cancel_standing_order(order_id):
    """Cancel a standing order"""
    from standing_orders_service import StandingOrderService
    
    uid = g.user_id
    success, message = StandingOrderService.cancel_standing_order(order_id, uid)
    
    if success:
        return jsonify({"success": True, "message": message}), 200
    else:
        return jsonify({"error": message}), 400


# --- ADMIN ROUTES ---

@app.route('/api/admin/users', methods=['GET'])
@check_firebase_auth
def admin_get_users():
    # Verify Admin Role
    # We should have a way to check this. For now, check the Firestore doc.
    user_ref = db.collection('users').document(g.user_id).get()
    if not user_ref.get('is_admin'):
        return jsonify({"error": "Unauthorized"}), 403

    users = []
    for doc in db.collection('users').stream():
        u = doc.to_dict()
        u['uid'] = doc.id
        users.append(u)
    return jsonify(users)

# --- POSTBOX ROUTES ---

@app.route('/api/documents', methods=['GET'])
@check_firebase_auth
def get_documents():
    uid = g.user_id
    
    docs = []
    # Query documents for this user
    # In a real app, this would query a 'documents' collection
    # For simulation, we'll generate some dummy data if empty or fetch real ones
    
    doc_ref = db.collection('documents').where('owner_uid', '==', uid).order_by('created_at', direction=firestore.Query.DESCENDING).stream()
    
    has_docs = False
    for d in doc_ref:
        has_docs = True
        doc_data = d.to_dict()
        doc_data['id'] = d.id
        docs.append(doc_data)
        
    if not has_docs:
        # Seed dummy documents for demo
        dummy_docs = [
            {
                "title": "Finanzstatus 12/2025",
                "type": "Statement",
                "created_at": datetime.now(),
                "owner_uid": uid,
                "download_url": "#" 
            },
            {
                "title": "AGB Änderung (Terms Update)",
                "type": "Legal",
                "created_at": datetime(2025, 11, 1),
                "owner_uid": uid,
                "download_url": "#"
            }
        ]
        
        batch = db.batch()
        for dd in dummy_docs:
            new_ref = db.collection('documents').document()
            batch.set(new_ref, dd)
        batch.commit()
        
        # Return the seeded docs formatted
        for dd in dummy_docs:
            dd['id'] = 'new' # simplistic
            docs.append(dd)

    return jsonify(docs)

# --- SOCKET.IO CHAT ---

@socketio.on('connect')
def handle_connect():
    # Verify Token manually from query param or auth packet
    token = request.args.get('token')
    if token:
        try:
            decoded = auth.verify_id_token(token)
            uid = decoded['uid']
            join_room(uid)
            print(f"User {uid} connected to chat")
        except:
            return False # Reject
    else:
        # Allow anonymous connection? No.
        pass

@socketio.on('send_message')
def handle_message(data):
    token = data.get('token')
    message = data.get('message')
    if not token or not message: return
    
    try:
        decoded = auth.verify_id_token(token)
        uid = decoded['uid']
        
        # Store in Firestore
        session_id = f"session_{uid}" # Simple single session per user
        chat_ref = db.collection('chats').document(session_id)
        
        if not chat_ref.get().exists:
            chat_ref.set({
                'user_uid': uid,
                'status': 'active',
                'started_at': firestore.SERVER_TIMESTAMP
            })
        
        chat_ref.collection('messages').add({
            'sender_uid': uid,
            'text': message,
            'timestamp': firestore.SERVER_TIMESTAMP,
            'sender_type': 'user'
        })
        
        # Notify Admins (Assuming they join 'admins' room)
        emit('receive_message', {'text': message, 'uid': uid}, room='admins')
        
    except Exception as e:
        print(f"Chat Error: {e}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Enable debug mode for verbose output during development
    socketio.run(app, host='0.0.0.0', port=port, debug=True)