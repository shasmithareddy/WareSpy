import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DemoPage from "./pages/DemoPage";
import Auth from "./pages/Auth";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import ZoneMonitor from "./pages/ZoneMonitor";
import HeatmapPage from "./pages/HeatmapPage";
import AlertsPage from "./pages/AlertsPage";
import WhatIfSimulator from "./pages/WhatIfSimulator";
import ShiftReports from "./pages/ShiftReports";
import PPECompliance from "./pages/features/PPECompliance";
import UnsafePosture from "./pages/features/UnsafePosture";
import FatigueAnalysis from "./pages/features/FatigueAnalysis";
import ActivityRecognition from "./pages/features/ActivityRecognition";
import MovementAnalytics from "./pages/features/MovementAnalytics";
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/features/ppe-compliance" element={<PPECompliance />} />
          <Route path="/features/unsafe-posture" element={<UnsafePosture />} />
          <Route path="/features/fatigue-analysis" element={<FatigueAnalysis />} />
          <Route path="/features/activity-recognition" element={<ActivityRecognition />} />
          <Route path="/features/movement-analytics" element={<MovementAnalytics />} />
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
