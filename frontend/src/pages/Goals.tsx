import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { goalService } from "@/services/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Target, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
}

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [fundOpen, setFundOpen] = useState<number | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [addFundAmount, setAddFundAmount] = useState("");

  const fetchGoals = async () => {
    if (!user) return;
    try {
      const res = await goalService.getAll();
      if (res.success) setGoals(res.data);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await goalService.create({ 
        name, 
        target_amount: parseFloat(targetAmount), 
        deadline: deadline || null 
      });
      if (res.success) {
        toast.success("Savings goal created");
        setName(""); setTargetAmount(""); setDeadline(""); setOpen(false);
        fetchGoals();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fundOpen === null) return;
    try {
      const res = await goalService.updateProgress(fundOpen, { amount: parseFloat(addFundAmount) });
      if (res.success) {
        toast.success("Funds added successfully");
        setAddFundAmount(""); setFundOpen(null);
        fetchGoals();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await goalService.delete(id);
      if (res.success) {
        toast.success("Goal deleted"); fetchGoals();
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="space-y-8"><Skeleton className="h-12 w-48" /><Skeleton className="h-[400px] rounded-2xl" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground mt-1">Stay focused on what you're saving for</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/10 rounded-2xl">
            <DialogHeader><DialogTitle>New Savings Goal</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input placeholder="e.g. New Macbook Air" required value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Amount (₹)</Label>
                  <Input type="number" step="1000" min="1000" required value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="rounded-xl border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>Deadline (Optional)</Label>
                  <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="rounded-xl border-white/10" />
                </div>
              </div>
              <Button type="submit" className="w-full rounded-xl py-6 text-lg font-semibold">Start Saving</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence>
          {goals.map((goal) => {
            const progress = (goal.current_amount / goal.target_amount) * 100;
            const isCompleted = progress >= 100;

            return (
              <motion.div key={goal.id} layout initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>
                <Card className="glass-card border-white/10 overflow-hidden relative group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                          {isCompleted ? <Trophy size={20} /> : <Target size={20} />}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold">{goal.name}</CardTitle>
                          {goal.deadline && (
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Target: {goal.deadline}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Current Savings</p>
                        <p className="text-2xl font-bold tracking-tight">₹{goal.current_amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="text-lg font-semibold opacity-80">₹{goal.target_amount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className={isCompleted ? 'text-green-500' : 'text-indigo-400'}>{progress.toFixed(1)}% Completed</span>
                        <span className="text-muted-foreground">₹{(goal.target_amount - goal.current_amount).toLocaleString()} to go</span>
                      </div>
                      <Progress value={progress} className={`h-2.5 rounded-full ${isCompleted ? 'bg-green-500/20' : 'bg-white/5'}`} />
                    </div>

                    {!isCompleted && (
                      <Dialog open={fundOpen === goal.id} onOpenChange={(o) => setFundOpen(o ? goal.id : null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full rounded-xl h-12 font-semibold border-indigo-500/20 hover:bg-indigo-500/5 text-indigo-400">
                            <Plus className="mr-2 h-4 w-4" /> Add Funds
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-card border-white/10 rounded-2xl">
                          <DialogHeader><DialogTitle>Add Funds to {goal.name}</DialogTitle></DialogHeader>
                          <form onSubmit={handleAddFund} className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Amount to Add (₹)</Label>
                              <Input type="number" step="100" min="100" required value={addFundAmount} onChange={(e) => setAddFundAmount(e.target.value)} className="rounded-xl border-white/10" />
                            </div>
                            <Button type="submit" className="w-full rounded-xl py-6 text-lg font-semibold">Confirm Deposit</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {goals.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground bg-white/5 border border-dashed border-white/10 rounded-3xl">
            <Target size={48} className="opacity-10 mb-4" />
            <p className="text-lg">No savings goals set yet</p>
            <p className="text-sm">What are you dreaming of? Start saving today!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
