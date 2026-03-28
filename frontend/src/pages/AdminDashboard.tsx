import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Users, Activity, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    { title: "Total Users", value: "1,284", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Now", value: "42", icon: Activity, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "System Status", value: "Healthy", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.display_name}. System overview and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Recent administrative actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Database Backup Completed</p>
                      <p className="text-xs text-muted-foreground">Today at 04:00 AM</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used administrative tools</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5">
              <Users className="w-6 h-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 border-white/10 hover:bg-white/5">
              <Settings className="w-6 h-6" />
              <span>System Settings</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
