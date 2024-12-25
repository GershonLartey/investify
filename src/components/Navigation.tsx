import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, User, Bell } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/investments", label: "Investments", icon: Wallet },
    { path: "/profile", label: "Profile", icon: User },
    { path: "/notifications", label: "Notifications", icon: Bell },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full py-2 ${
                isActive(item.path)
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <item.icon
                size={24}
                className={isActive(item.path) ? "text-primary" : "text-gray-500"}
              />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;