import { useState } from "react";
import { motion } from "framer-motion";
import { authService } from "@/services/index";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await authService.login({ email, password });
        if (res.success && res.access_token) {
          signIn(res.access_token, res.user);
          toast.success("Welcome back!");
          navigate("/");
        }
      } else {
        const res = await authService.register({ email, password, display_name: displayName });
        if (res.success) {
          toast.success("Account created! Please login.");
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">FinTrack</CardTitle>
            <CardDescription>
              {isLogin ? "Login to manage your wallet" : "Create an account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input 
                    placeholder="Your Name" 
                    required 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : (isLogin ? "Login" : "Sign Up")}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
