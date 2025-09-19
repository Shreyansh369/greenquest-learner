import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStore } from "./store/useStore";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";

// Import screens
import AuthScreen from "./screens/AuthScreen";
import HomeScreen from "./screens/HomeScreen";
import LessonScreen from "./screens/LessonScreen";
import QuizScreen from "./screens/QuizScreen";
import QuestScreen from "./screens/QuestScreen";
import TeacherScreen from "./screens/TeacherScreen";
import MarketplaceScreen from "./screens/MarketplaceScreen";
import WalletScreen from "./screens/WalletScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { user, profile, loading } = useAuth();
  const { setCurrentUser } = useStore();
  
  // Update store when profile changes
  useEffect(() => {
    setCurrentUser(profile);
  }, [profile, setCurrentUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            {loading ? (
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Routes>
                {!user ? (
                  <>
                    <Route path="/" element={<AuthScreen />} />
                    <Route path="/auth" element={<AuthScreen />} />
                  </>
                ) : (
                <>
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/home" element={<HomeScreen />} />
                  <Route path="/lesson/:nodeId" element={<LessonScreen />} />
                  <Route path="/quiz/:nodeId" element={<QuizScreen />} />
                  <Route path="/quest/:questId" element={<QuestScreen />} />
                  <Route path="/teacher" element={<TeacherScreen />} />
                  <Route path="/marketplace" element={<MarketplaceScreen />} />
                  <Route path="/wallet" element={<WalletScreen />} />
                  <Route path="/leaderboard" element={<LeaderboardScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/settings" element={<SettingsScreen />} />
                </>
                )}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
