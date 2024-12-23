import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";

const Messages = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Messages & Notifications</h1>

      <div className="space-y-4">
        {/* Empty state */}
        <Card className="p-8 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any messages or notifications at the moment
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Messages;