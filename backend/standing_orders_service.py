"""
Standing Orders (Dauerauftrag) Service
Manages recurring payments for German banking.
"""
from datetime import datetime, timedelta
from firebase_admin import firestore
from firebase_service import get_db
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)
db = get_db()


class StandingOrderService:
    """Service for managing standing orders (Dauerauftrag)"""
    
    @staticmethod
    def create_standing_order(
        user_id: str,
        from_account_id: str,
        to_account_id: str,
        amount: float,
        reference: str,
        frequency: str,  # 'monthly', 'weekly', 'quarterly'
        start_date: datetime,
        end_date: Optional[datetime] = None,
        execution_day: int = 1  # Day of month for monthly, day of week for weekly
    ) -> tuple[bool, str, Optional[str]]:
        """
        Create a new standing order.
        
        Args:
            user_id: Owner user ID
            from_account_id: Source account
            to_account_id: Destination account (can be external)
            amount: Transfer amount
            reference: Payment reference (Verwendungszweck)
            frequency: Payment frequency
            start_date: First execution date
            end_date: Optional end date
            execution_day: Day of execution
        
        Returns:
            Tuple of (success, message, standing_order_id)
        """
        try:
            # Validate amount
            if amount <= 0:
                return False, "Ungültiger Betrag", None
            
            # Validate frequency
            valid_frequencies = ['monthly', 'weekly', 'quarterly', 'yearly']
            if frequency not in valid_frequencies:
                return False, "Ungültige Frequenz", None
            
            # Validate source account ownership
            acc_ref = db.collection('accounts').document(from_account_id)
            acc_snap = acc_ref.get()
            
            if not acc_snap.exists or acc_snap.get('owner_uid') != user_id:
                return False, "Ungültiges Quellkonto", None
            
            # Create standing order
            standing_order_data = {
                'owner_uid': user_id,
                'from_account_id': from_account_id,
                'to_account_id': to_account_id,
                'amount': amount,
                'reference': reference,
                'frequency': frequency,
                'start_date': start_date,
                'end_date': end_date,
                'execution_day': execution_day,
                'status': 'active',
                'created_at': firestore.SERVER_TIMESTAMP,
                'last_executed': None,
                'next_execution': start_date
            }
            
            so_ref = db.collection('standing_orders').add(standing_order_data)
            standing_order_id = so_ref[1].id
            
            logger.info(f"Standing order created: {standing_order_id} for user {user_id}")
            
            return True, "Dauerauftrag erfolgreich erstellt", standing_order_id
            
        except Exception as e:
            logger.error(f"Error creating standing order: {str(e)}")
            return False, f"Fehler beim Erstellen: {str(e)}", None
    
    @staticmethod
    def get_user_standing_orders(user_id: str) -> List[Dict]:
        """
        Get all standing orders for a user.
        
        Args:
            user_id: User ID
        
        Returns:
            List of standing orders
        """
        try:
            orders = []
            docs = db.collection('standing_orders')\
                .where('owner_uid', '==', user_id)\
                .order_by('created_at', direction=firestore.Query.DESCENDING)\
                .stream()
            
            for doc in docs:
                order = doc.to_dict()
                order['id'] = doc.id
                
                # Convert timestamps to strings for JSON serialization
                if order.get('start_date'):
                    order['start_date'] = order['start_date'].isoformat() if hasattr(order['start_date'], 'isoformat') else str(order['start_date'])
                if order.get('end_date'):
                    order['end_date'] = order['end_date'].isoformat() if hasattr(order['end_date'], 'isoformat') else str(order['end_date'])
                if order.get('next_execution'):
                    order['next_execution'] = order['next_execution'].isoformat() if hasattr(order['next_execution'], 'isoformat') else str(order['next_execution'])
                
                orders.append(order)
            
            return orders
            
        except Exception as e:
            logger.error(f"Error fetching standing orders: {str(e)}")
            return []
    
    @staticmethod
    def cancel_standing_order(standing_order_id: str, user_id: str) -> tuple[bool, str]:
        """
        Cancel a standing order.
        
        Args:
            standing_order_id: Standing order ID
            user_id: User ID (for authorization)
        
        Returns:
            Tuple of (success, message)
        """
        try:
            so_ref = db.collection('standing_orders').document(standing_order_id)
            so_snap = so_ref.get()
            
            if not so_snap.exists:
                return False, "Dauerauftrag nicht gefunden"
            
            so_data = so_snap.to_dict()
            
            # Verify ownership
            if so_data.get('owner_uid') != user_id:
                return False, "Nicht autorisiert"
            
            # Update status to cancelled
            so_ref.update({
                'status': 'cancelled',
                'cancelled_at': firestore.SERVER_TIMESTAMP
            })
            
            logger.info(f"Standing order cancelled: {standing_order_id}")
            
            return True, "Dauerauftrag erfolgreich gekündigt"
            
        except Exception as e:
            logger.error(f"Error cancelling standing order: {str(e)}")
            return False, f"Fehler beim Kündigen: {str(e)}"
    
    @staticmethod
    def execute_due_standing_orders():
        """
        Execute all standing orders that are due.
        This should be called by a scheduled job (cron).
        
        Returns:
            Number of orders executed
        """
        try:
            today = datetime.now().date()
            executed_count = 0
            
            # Find active standing orders where next_execution <= today
            orders = db.collection('standing_orders')\
                .where('status', '==', 'active')\
                .where('next_execution', '<=', datetime.combine(today, datetime.min.time()))\
                .stream()
            
            for order_doc in orders:
                order_data = order_doc.to_dict()
                order_id = order_doc.id
                
                # Execute the transfer
                success = StandingOrderService._execute_single_order(order_id, order_data)
                
                if success:
                    executed_count += 1
                    
                    # Calculate next execution date
                    next_date = StandingOrderService._calculate_next_execution(
                        order_data['next_execution'],
                        order_data['frequency'],
                        order_data.get('execution_day', 1)
                    )
                    
                    # Update standing order
                    updates = {
                        'last_executed': firestore.SERVER_TIMESTAMP,
                        'next_execution': next_date
                    }
                    
                    # Check if we've reached the end date
                    if order_data.get('end_date') and next_date > order_data['end_date']:
                        updates['status'] = 'completed'
                    
                    db.collection('standing_orders').document(order_id).update(updates)
            
            logger.info(f"Executed {executed_count} standing orders")
            return executed_count
            
        except Exception as e:
            logger.error(f"Error executing standing orders: {str(e)}")
            return 0
    
    @staticmethod
    def _execute_single_order(order_id: str, order_data: Dict) -> bool:
        """Execute a single standing order transfer"""
        try:
            # This would use the same transfer logic as regular transfers
            # For now, just log it
            logger.info(f"Executing standing order {order_id}: {order_data['amount']} from {order_data['from_account_id']} to {order_data['to_account_id']}")
            
            # TODO: Implement actual transfer execution
            # Should create a transaction record and update balances
            
            return True
            
        except Exception as e:
            logger.error(f"Error executing standing order {order_id}: {str(e)}")
            return False
    
    @staticmethod
    def _calculate_next_execution(current_date: datetime, frequency: str, execution_day: int) -> datetime:
        """Calculate the next execution date based on frequency"""
        if frequency == 'monthly':
            # Next month, same day
            next_month = current_date.month + 1
            next_year = current_date.year
            if next_month > 12:
                next_month = 1
                next_year += 1
            
            # Handle day overflow (e.g., Jan 31 -> Feb 28)
            import calendar
            max_day = calendar.monthrange(next_year, next_month)[1]
            day = min(execution_day, max_day)
            
            return datetime(next_year, next_month, day)
            
        elif frequency == 'weekly':
            return current_date + timedelta(days=7)
            
        elif frequency == 'quarterly':
            # 3 months later
            next_month = current_date.month + 3
            next_year = current_date.year
            while next_month > 12:
                next_month -= 12
                next_year += 1
            
            import calendar
            max_day = calendar.monthrange(next_year, next_month)[1]
            day = min(execution_day, max_day)
            
            return datetime(next_year, next_month, day)
            
        elif frequency == 'yearly':
            return datetime(current_date.year + 1, current_date.month, execution_day)
        
        return current_date
