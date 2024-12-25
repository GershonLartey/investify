import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "./hooks/useNotifications";
import NotificationItem from "./components/NotificationItem";

const Notifications = () => {
  const { toast } = useToast();
  const { data: notifications = [], isError } = useNotifications();

  if (isError) {
    return (
      <div className="p-4">
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-600">Error loading notifications. Please try again later.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any notifications at the moment
            </p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;