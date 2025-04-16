import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RealTimeData from "./pages/RealTimeData";
import SafetyGuidelines from "./pages/SafetyGuidelines";
import EarthquakeStatistics from "./pages/EarthquakeStatistics";
import EarthquakeByRegion from "./pages/EarthquakeByRegion";
import EmergencyResources from "./pages/EmergencyResources";
import EducationalMaterials from "./pages/EducationalMaterials";
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
          <Route path="/real-time-data" element={<RealTimeData />} />
          <Route path="/safety-guidelines" element={<SafetyGuidelines />} />
          <Route path="/earthquake-statistics" element={<EarthquakeStatistics />} />
          <Route path="/earthquake-by-region" element={<EarthquakeByRegion />} />
          <Route path="/emergency-resources" element={<EmergencyResources />} />
          <Route path="/educational-materials" element={<EducationalMaterials />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
