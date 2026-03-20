import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import AppLayout from "./components/AppLayout";
import { ScrollToTop } from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import CompanyCreate from "./pages/CompanyCreate";
import Chat from "./pages/Chat";
import More from "./pages/More";
import Signals from "./pages/Signals";
import Ideas from "./pages/Ideas";

import Arena from "./pages/Arena";
import Live from "./pages/Live";
import Landing from "./pages/Landing";

import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/landing" element={<Landing />} />
            <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/agents" element={<AppLayout><Agents /></AppLayout>} />
            <Route path="/agents/:id" element={<AppLayout><AgentDetail /></AppLayout>} />
            <Route path="/companies" element={<AppLayout><Companies /></AppLayout>} />
            <Route path="/companies/new" element={<AppLayout><CompanyCreate /></AppLayout>} />
            <Route path="/companies/:id" element={<AppLayout><CompanyDetail /></AppLayout>} />
            <Route path="/chat" element={<AppLayout><Chat /></AppLayout>} />
            <Route path="/more" element={<AppLayout><More /></AppLayout>} />
            <Route path="/more/signals" element={<AppLayout><Signals /></AppLayout>} />
            <Route path="/more/ideas" element={<AppLayout><Ideas /></AppLayout>} />
            <Route path="/more/personal-os" element={<AppLayout><PersonalOS /></AppLayout>} />
            <Route path="/more/arena" element={<AppLayout><Arena /></AppLayout>} /> {/* kept as fallback */}
            <Route path="/more/live" element={<AppLayout><Live /></AppLayout>} />
            
            
            <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
