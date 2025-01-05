import { Link, useLocation } from "react-router-dom";
import { Home, TrendingUp, User, Bell } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

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
            to="/notifications"
            className={`flex flex-col items-center p-1 ${
              isActive("/notifications") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Bell className="h-5 w-5" />
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