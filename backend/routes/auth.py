from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from utils.otp import generate_otp
from utils.email_service import send_otp_email
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    display_name = data.get('display_name')

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email address already exists"}), 409

    new_user = User(email=email, display_name=display_name)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)
    return jsonify(access_token=access_token, user=new_user.to_dict(), success=True), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        # Generate OTP
        otp = generate_otp()
        user.otp = otp
        user.otp_expiry = datetime.utcnow() + timedelta(minutes=10)
        db.session.commit()

        # Send OTP Email
        try:
            send_otp_email(user.email, otp)
        except Exception as e:
            print(f"Failed to send email: {e}")
            print(f"OTP for {user.email} is: {otp}") # Print to console for development

        return jsonify({"success": True, "message": "OTP sent to your email"})
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    print(f"DEBUG: Verifying OTP. Submitted: {otp}, Stored: {user.otp}, Expiry: {user.otp_expiry}, Now: {datetime.utcnow()}")

    if user.otp and user.otp == str(otp) and user.otp_expiry > datetime.utcnow():
        # Clear OTP after successful verification
        user.otp = None
        user.otp_expiry = None
        db.session.commit()

        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user=user.to_dict(), success=True)
    
    return jsonify({"error": "Invalid or expired OTP"}), 401

# =========================
# GET CURRENT USER (UNCHANGED)
# =========================
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404

    return jsonify({
        "success": True,
        "user": user.to_dict()
    }), 200