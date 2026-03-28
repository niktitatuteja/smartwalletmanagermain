from flask import Blueprint, request, jsonify
import time
import random
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Transaction
from datetime import date

sandbox_bp = Blueprint('sandbox', __name__)

@sandbox_bp.route('/process-payment', methods=['POST'])
@jwt_required()
def process_payment():
    """
    Simulated Payment Sandbox API
    This endpoint mimics a real payment gateway response.
    """
    current_user_id = get_jwt_identity()
    data = request.get_json()
    print(f"[DEBUG] Received payment data: {data}")

    amount = data.get('amount')
    category = data.get('category', 'Other')
    payment_method_raw = data.get('payment_method', 'Card')
    payment_method = payment_method_raw if payment_method_raw in ['Card', 'UPI', 'Cash'] else 'Card'
    notes = data.get('notes', 'Payment via Sandbox')

    print(f"[DEBUG] Parsed payment data: amount={amount}, category={category}, payment_method={payment_method}")

    if not amount or float(amount) <= 0:
        print(f"[DEBUG] Invalid amount: {amount}")
        return jsonify({"success": False, "error": "Invalid amount"}), 400

    # Simulate network latency
    time.sleep(1.5)
    
    # 95% success rate simulation
    is_success = random.random() < 0.95
    
    if is_success:
        try:
            # Automatically create the transaction in the database
            new_transaction = Transaction(
                user_id=current_user_id,
                amount=float(amount),
                type='Expense',
                category=category,
                date=date.today(),
                payment_method=payment_method,
                notes=notes
            )
            db.session.add(new_transaction)

            # Update user balance
            user = User.query.get(current_user_id)
            if user:
                user.balance -= float(amount)

            db.session.commit()
            
            return jsonify({
                "success": True,
                "message": "Payment processed successfully",
                "transaction_id": new_transaction.id,
                "data": new_transaction.to_dict()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "error": f"Database error: {str(e)}"}), 500
    else:
        return jsonify({
            "success": False, 
            "error": "Payment declined by simulated bank. Please try again."
        }), 402
