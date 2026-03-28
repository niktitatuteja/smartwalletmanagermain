import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/index";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.success) {
        toast.success("OTP sent to your email!");
        setStep(2);
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp });
      if (res.success && res.access_token) {
        signIn(res.access_token, res.user);
        toast.success(`Welcome back, ${res.user.display_name}!`);
        
        // Redirect based on role
        if (res.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#020817]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="glass-card border-white/10 shadow-2xl bg-[#0f172a]/80 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                <ShieldCheck className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">SmartWallet</CardTitle>
            <CardDescription className="text-gray-400">
              {step === 1 ? "Secure access to your finances" : "Enter the verification code"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="login-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLogin}
                  className="space-y-4 pt-4"
                >
                  <div className="space-y-2">
                    <Label className="text-gray-300">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        type="email" 
                        placeholder="name@example.com" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-[#020817] border-white/10 text-white focus:ring-purple-500/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        type="password" 
                        placeholder="••••••••"
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-[#020817] border-white/10 text-white focus:ring-purple-500/50"
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 text-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/20" 
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send OTP"}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="verify-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleVerify}
                  className="space-y-4 pt-4"
                >
                  <div className="space-y-2">
                    <Label className="text-gray-300">Verification Code</Label>
                    <Input 
                      placeholder="Enter 6-digit OTP" 
                      required 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      className="text-center text-2xl tracking-[0.5em] h-14 bg-[#020817] border-white/10 text-white focus:ring-green-500/50"
                    />
                    <p className="text-xs text-center text-gray-500 mt-2">
                      We've sent a code to <span className="text-purple-400">{email}</span>
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-11 text-lg font-semibold transition-all duration-300 shadow-lg shadow-green-500/20" 
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify & Login"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full text-gray-400 hover:text-white" 
                    onClick={() => setStep(1)}
                  >
                    Back to Login
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
