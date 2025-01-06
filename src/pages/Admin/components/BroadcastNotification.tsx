import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const BroadcastNotification = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const broadcastMutation = useMutation({
    mutationFn: async () => {
      console.log("Broadcasting notification to all users...");
      
      // Get all users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id');
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Create notifications for all users
      const notifications = profiles.map(profile => ({
        user_id: profile.id,
        title,
        message,
        type,
        is_broadcast: true,
        read: false
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (error) {
        console.error("Error inserting notifications:", error);
        throw error;
      }
    },
    onSuccess: () => {
      setTitle("");
      setMessage("");
      setType("info");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Success",
        description: "Broadcast notification sent successfully",
      });
    },
    onError: (error) => {
      console.error("Error in broadcast mutation:", error);
      toast({
        title: "Error",
        description: "Failed to send broadcast notification",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    broadcastMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Broadcast Notification</h2>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification title"
              disabled={broadcastMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              rows={4}
              disabled={broadcastMutation.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select 
              value={type} 
              onValueChange={setType}
              disabled={broadcastMutation.isPending}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit"
            disabled={broadcastMutation.isPending}
            className="w-full"
          >
            {broadcastMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Broadcast"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BroadcastNotification;