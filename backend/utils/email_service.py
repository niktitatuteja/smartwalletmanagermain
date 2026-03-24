import sib_api_v3_sdk
from dotenv import load_dotenv
import os
import random

load_dotenv()

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(to_email, otp):
    config = sib_api_v3_sdk.Configuration()
    config.api_key['api-key'] = os.getenv("BREVO_API_KEY")

    api = sib_api_v3_sdk.TransactionalEmailsApi(
        sib_api_v3_sdk.ApiClient(config)
    )

    email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email": to_email}],
        sender={"email": os.getenv("SENDER_EMAIL")},
        subject="OTP Code",
        html_content=f"<h2>Your OTP is {otp}</h2>"
    )

    api.send_transac_email(email)