import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const handleLogin = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/login", {
        email,
        password,
      });
      alert("OTP sent to email");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      alert("Login successful");

      // save token
      localStorage.setItem("token", res.data.access_token);

      // redirect (simple)
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.error || "OTP failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={handleLogin}>Login</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />

          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}