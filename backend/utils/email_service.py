import sib_api_v3_sdk
from dotenv import load_dotenv
import os
import random

load_dotenv()

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(to_email, otp):
    api_key = os.getenv("BREVO_API_KEY")
    sender_email = os.getenv("SENDER_EMAIL")
    
    if not api_key or api_key == "dummy":
        print(f"DEBUG: Skipping email sending (no API key). OTP for {to_email} is: {otp}")
        return True

    try:
        config = sib_api_v3_sdk.Configuration()
        config.api_key['api-key'] = api_key

        api = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(config)
        )

        email = sib_api_v3_sdk.SendSmtpEmail(
            to=[{"email": to_email}],
            sender={"email": sender_email},
            subject="OTP Code",
            html_content=f"<h2>Your OTP is {otp}</h2>"
        )

        api.send_transac_email(email)
        return True
    except Exception as e:
        print(f"ERROR: Failed to send email via Brevo: {e}")
        print(f"DEBUG: OTP for {to_email} is: {otp}")
        return False