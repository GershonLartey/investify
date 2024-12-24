import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSendMessage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log("Sending message for user:", user.id);
      const { data, error } = await supabase
        .from("messages")
        .insert({
          content,
          user_id: user.id,
        })
        .select();

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      console.log("Message sent successfully:", data);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast({
        title: "Message sent",
        description: "Your message has been sent to support",
      });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });
};