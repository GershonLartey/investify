import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, ArrowUpDown, TrendingUp, User, Bell } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between py-2">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center p-2 ${
              isActive("/dashboard") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            to="/deposit"
            className={`flex flex-col items-center p-2 ${
              isActive("/deposit") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Wallet className="h-6 w-6" />
            <span className="text-xs mt-1">Deposit</span>
          </Link>

          <Link
            to="/transactions"
            className={`flex flex-col items-center p-2 ${
              isActive("/transactions") ? "text-primary" : "text-gray-500"
            }`}
          >
            <ArrowUpDown className="h-6 w-6" />
            <span className="text-xs mt-1">History</span>
          </Link>

          <Link
            to="/investments"
            className={`flex flex-col items-center p-2 ${
              isActive("/investments") ? "text-primary" : "text-gray-500"
            }`}
          >
            <TrendingUp className="h-6 w-6" />
            <span className="text-xs mt-1">Invest</span>
          </Link>

          <Link
            to="/notifications"
            className={`flex flex-col items-center p-2 ${
              isActive("/notifications") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Bell className="h-6 w-6" />
            <span className="text-xs mt-1">Alerts</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center p-2 ${
              isActive("/profile") ? "text-primary" : "text-gray-500"
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;