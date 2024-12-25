import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    created_at: string;
    read: boolean;
  };
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className={cn(
      "p-4 transition-colors",
      notification.read ? "bg-gray-50" : "bg-white"
    )}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{notification.title}</h3>
          <p className="text-gray-600">{notification.message}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default NotificationItem;