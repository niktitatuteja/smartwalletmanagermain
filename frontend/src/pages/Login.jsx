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
      alert("OTP sent to your email");
      setStep(2);
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/verify-otp", {
        email,
        otp,
      });

      alert("Login successful");

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect
      window.location.href = "/";
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Login</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button onClick={handleLogin}>Login</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
          />
          <br />
          <button onClick={handleVerify}>Verify OTP</button>
        </>
      )}
    </div>
  );
}