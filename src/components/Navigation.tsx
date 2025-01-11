import { Link, useLocation } from "react-router-dom";
import { Home, TrendingUp, User, Bell, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Query unread notifications count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: async () => {
      console.log('Fetching unread notifications count...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
      }

      console.log('Unread notifications count:', count);
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between py-2 space-x-2">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center p-1 ${
              isActive("/dashboard") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>

          <Link
            to="/investments"
            className={`flex flex-col items-center p-1 ${
              isActive("/investments") ? "text-primary" : "text-gray-500"
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Invest</span>
          </Link>

          <Link
            to="/transactions"
            className={`flex flex-col items-center p-1 ${
              isActive("/transactions") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Transactions</span>
          </Link>

          <Link
            to="/notifications"
            className={`flex flex-col items-center p-1 relative ${
              isActive("/notifications") ? "text-primary" : "text-gray-500"
            }`}
          >
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500"
                  variant="destructive"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <span className="text-xs">Alerts</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center p-1 ${
              isActive("/profile") ? "text-primary" : "text-gray-500"
            }`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
