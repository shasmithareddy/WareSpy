import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/app/Sidebar";
import Header from "@/components/app/Header";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64">
        <Header alertCount={4} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
