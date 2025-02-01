import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "./components/Navigation";
import TidioChat from "./components/TidioChat";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdrawal from "./pages/Withdrawal";
import Investments from "./pages/Investments";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import TransactionHistory from "./pages/TransactionHistory";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        setSession(session);
      } catch (error: any) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing cache...');
        queryClient.clear();
        setSession(null);
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in, updating session...');
        setSession(session);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App = () => {
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (error: any) {
        console.error("Auth initialization error:", error);
        toast({
          title: "Error",
          description: "Failed to initialize authentication",
          variant: "destructive",
        });
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in App:", event);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <main className="pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/deposit"
                    element={
                      <PrivateRoute>
                        <Deposit />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/withdrawal"
                    element={
                      <PrivateRoute>
                        <Withdrawal />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/investments"
                    element={
                      <PrivateRoute>
                        <Investments />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <PrivateRoute>
                        <Notifications />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/transactions"
                    element={
                      <PrivateRoute>
                        <TransactionHistory />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute>
                        <Admin />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </main>
              {session && <Navigation />}
              <TidioChat />
            </div>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;