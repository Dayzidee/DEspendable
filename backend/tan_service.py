"""
TAN (Transaction Authentication Number) Service
Implements Strong Customer Authentication (SCA) for PSD2 compliance.
"""
from datetime import datetime, timedelta
from firebase_admin import firestore
from firebase_service import get_db
import secrets
import hashlib
import logging
from typing import Tuple, Optional

logger = logging.getLogger(__name__)
db = get_db()


class TANService:
    """Service for generating and validating TANs"""

    @staticmethod
    def generate_tan(length: int = 6) -> str:
        """
        Generate a cryptographically secure TAN.

        Args:
            length: Length of the TAN (default 6 digits)

        Returns:
            TAN string
        """
        # Generate random number with specified length
        tan = ''.join([str(secrets.randbelow(10)) for _ in range(length)])
        return tan

    @staticmethod
    def create_tan_challenge(
        user_id: str,
        transaction_id: str,
        amount: float,
        recipient: str,
        tan_type: str = 'pushTAN'
    ) -> Tuple[str, dict]:
        """
        Create a TAN challenge with dynamic linking.
        Dynamic linking binds the TAN to specific transaction details (amount + recipient).

        Args:
            user_id: User ID
            transaction_id: Transaction ID
            amount: Transaction amount
            recipient: Recipient identifier (IBAN or account number)
            tan_type: Type of TAN (pushTAN, photoTAN, chipTAN)

        Returns:
            Tuple of (tan_id, challenge_data)
        """
        from config import get_config
        config = get_config()

        # Generate TAN
        tan = TANService.generate_tan(config.TAN_LENGTH)

        # Create dynamic linking hash (binds TAN to transaction details)
        dynamic_link = hashlib.sha256(
            f"{transaction_id}:{amount}:{recipient}".encode()
        ).hexdigest()

        # Calculate expiration
        expiration = datetime.utcnow() + timedelta(minutes=config.TAN_EXPIRATION_MINUTES)

        # Store TAN challenge in Firestore
        tan_data = {
            'user_id': user_id,
            'transaction_id': transaction_id,
            'tan_hash': hashlib.sha256(tan.encode()).hexdigest(),
            'dynamic_link': dynamic_link,
            'amount': amount,
            'recipient': recipient,
            'tan_type': tan_type,
            'created_at': firestore.SERVER_TIMESTAMP,
            'expires_at': expiration,
            'status': 'pending',
            'attempts': 0
        }

        # Save to Firestore
        tan_ref = db.collection('tan_challenges').add(tan_data)
        tan_id = tan_ref[1].id

        logger.info(f"TAN challenge created: {tan_id} for transaction {transaction_id}")

        # Prepare challenge data for response
        challenge_data = {
            'tan_id': tan_id,
            'type': tan_type,
            'expires_in': config.TAN_EXPIRATION_MINUTES * 60,  # seconds
            'transaction_details': {
                'amount': amount,
                'recipient': recipient
            }
        }

        # In a real system, we would NOT return the TAN
        # Instead, it would be sent via:
        # - Push notification (pushTAN)
        # - QR code generation (photoTAN)
        # - Hardware device (chipTAN)

        # For demo purposes, we return it
        if config.DEBUG:
            challenge_data['mock_tan'] = tan  # ONLY FOR DEMO

        return tan_id, challenge_data

    @staticmethod
    def validate_tan(
        tan_id: str,
        tan_input: str,
        transaction_id: str,
        amount: float,
        recipient: str
    ) -> Tuple[bool, str]:
        """
        Validate a TAN with dynamic linking verification.

        Args:
            tan_id: TAN challenge ID
            tan_input: TAN entered by user
            transaction_id: Transaction ID
            amount: Transaction amount
            recipient: Recipient identifier

        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            # Retrieve TAN challenge
            tan_ref = db.collection('tan_challenges').document(tan_id)
            tan_doc = tan_ref.get()

            if not tan_doc.exists:
                return False, "TAN-Challenge nicht gefunden"

            tan_data = tan_doc.to_dict()

            # Check if already used
            if tan_data.get('status') != 'pending':
                return False, "TAN wurde bereits verwendet"

            # Check expiration
            expires_at = tan_data.get('expires_at')
            if expires_at and datetime.utcnow() > expires_at:
                tan_ref.update({'status': 'expired'})
                return False, "TAN ist abgelaufen"

            # Check attempt limit (max 3 attempts)
            attempts = tan_data.get('attempts', 0)
            if attempts >= 3:
                tan_ref.update({'status': 'locked'})
                return False, "Zu viele Fehlversuche. TAN gesperrt."

            # Verify dynamic linking (transaction details must match)
            expected_link = hashlib.sha256(
                f"{transaction_id}:{amount}:{recipient}".encode()
            ).hexdigest()

            if tan_data.get('dynamic_link') != expected_link:
                logger.warning(f"Dynamic linking mismatch for TAN {tan_id}")
                return False, "Transaktionsdetails stimmen nicht überein"

            # Verify TAN
            tan_hash = hashlib.sha256(tan_input.encode()).hexdigest()

            if tan_data.get('tan_hash') != tan_hash:
                # Increment attempts
                tan_ref.update({'attempts': attempts + 1})
                remaining = 3 - (attempts + 1)
                return False, f"Ungültige TAN. Noch {remaining} Versuche übrig."

            # TAN is valid - mark as used
            tan_ref.update({
                'status': 'used',
                'used_at': firestore.SERVER_TIMESTAMP
            })

            logger.info(f"TAN validated successfully: {tan_id}")
            return True, ""

        except Exception as e:
            logger.error(f"TAN validation error: {str(e)}")
            return False, "Fehler bei der TAN-Validierung"

    @staticmethod
    def cancel_tan(tan_id: str) -> bool:
        """
        Cancel a TAN challenge.

        Args:
            tan_id: TAN challenge ID

        Returns:
            Success status
        """
        try:
            tan_ref = db.collection('tan_challenges').document(tan_id)
            tan_ref.update({
                'status': 'cancelled',
                'cancelled_at': firestore.SERVER_TIMESTAMP
            })
            logger.info(f"TAN cancelled: {tan_id}")
            return True
        except Exception as e:
            logger.error(f"Error cancelling TAN: {str(e)}")
            return False

    @staticmethod
    def cleanup_expired_tans():
        """
        Cleanup expired TAN challenges (should be run periodically).
        """
        try:
            # Find expired TANs
            expired_tans = db.collection('tan_challenges')\
                .where('status', '==', 'pending')\
                .where('expires_at', '<', datetime.utcnow())\
                .stream()

            count = 0
            for tan_doc in expired_tans:
                tan_doc.reference.update({'status': 'expired'})
                count += 1

            logger.info(f"Cleaned up {count} expired TANs")
            return count

        except Exception as e:
            logger.error(f"Error cleaning up TANs: {str(e)}")
            return 0
