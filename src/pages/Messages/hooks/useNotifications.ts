import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        console.log("Fetching notifications for user:", user.id);
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching notifications:", error);
          throw error;
        }

        console.log("Notifications fetched successfully:", data);
        return data || [];
      } catch (error) {
        console.error("Error in notifications query:", error);
        throw error;
      }
    },
    retry: 1,
  });
};