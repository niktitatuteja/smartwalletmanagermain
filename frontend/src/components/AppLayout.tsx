import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import BottomNav from "./BottomNav";
import { useMobile } from "@/hooks/use-mobile";

export default function AppLayout() {
  const isMobile = useMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        {!isMobile && <AppSidebar />}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scrollbar-hide">
            <div className="max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </div>
          {isMobile && <BottomNav />}
        </main>
      </div>
    </SidebarProvider>
  );
}
