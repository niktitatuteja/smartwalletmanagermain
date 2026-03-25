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
      setStep(2);
    } catch {
      alert("Login failed");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020817] text-white">
      
      <div className="w-full max-w-md bg-[#0f172a] p-8 rounded-2xl shadow-lg border border-white/10">
        
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded-lg bg-[#020817] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-4 rounded-lg bg-[#020817] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleLogin}
              className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              className="w-full p-3 mb-4 rounded-lg bg-[#020817] border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerify}
              className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
            >
              Verify & Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}