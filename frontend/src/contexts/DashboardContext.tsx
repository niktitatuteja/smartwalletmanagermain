import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/services/index';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await dashboardService.getSummary();
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <DashboardContext.Provider value={{ data, loading, refetch: fetchDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
