import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScanSetup from "./pages/ScanSetup";
import ScanVersions from "./pages/ScanVersions";
import BugList from "./pages/BugList";
import RepoHistory from "./pages/RepoHistory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ScanSetup />} />
          <Route path="/scan-versions" element={<ScanVersions />} />
          <Route path="/repo-history" element={<RepoHistory />} />
          <Route path="/bugs/:versionId" element={<BugList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
