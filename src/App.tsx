import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DemoPage from "./pages/DemoPage";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import ZoneMonitor from "./pages/ZoneMonitor";
import HeatmapPage from "./pages/HeatmapPage";
import AlertsPage from "./pages/AlertsPage";
import WhatIfSimulator from "./pages/WhatIfSimulator";
import ShiftReports from "./pages/ShiftReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/zones" element={<ZoneMonitor />} />
            <Route path="/heatmap" element={<HeatmapPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/simulator" element={<WhatIfSimulator />} />
            <Route path="/reports" element={<ShiftReports />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
