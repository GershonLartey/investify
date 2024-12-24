import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        console.log("Fetching messages for user:", user.id);
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching messages:", error);
          throw error;
        }

        console.log("Messages fetched successfully:", data);
        return data || [];
      } catch (error) {
        console.error("Error in messages query:", error);
        throw error;
      }
    },
    retry: 1,
  });
};