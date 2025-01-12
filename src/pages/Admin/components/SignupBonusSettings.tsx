import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const SignupBonusSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newAmount, setNewAmount] = useState("");
  const [welcomeTitle, setWelcomeTitle] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['signup-bonus-settings'],
    queryFn: async () => {
      console.log('Fetching signup bonus settings...');
      const { data, error } = await supabase
        .from('signup_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching signup bonus settings:', error);
        throw error;
      }
      
      // Set the welcome message states
      setWelcomeTitle(data.default_welcome_title);
      setWelcomeMessage(data.default_welcome_message);
      
      console.log('Fetched signup bonus settings:', data);
      return data;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      console.log('Updating signup settings:', { 
        bonus_amount: newAmount, 
        default_welcome_title: welcomeTitle,
        default_welcome_message: welcomeMessage 
      });
      
      const { error } = await supabase
        .from('signup_settings')
        .update({ 
          bonus_amount: parseFloat(newAmount || settings?.bonus_amount.toString() || "0"),
          default_welcome_title: welcomeTitle,
          default_welcome_message: welcomeMessage
        })
        .eq('id', settings?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      console.log('Successfully updated signup settings');
      queryClient.invalidateQueries({ queryKey: ['signup-bonus-settings'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
      setNewAmount("");
    },
    onError: (error) => {
      console.error('Error updating signup settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAmount && (isNaN(parseFloat(newAmount)) || parseFloat(newAmount) < 0)) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    updateSettingsMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Signup Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Bonus Amount</h3>
          <div className="mb-4">
            <p className="text-muted-foreground">
              Current signup bonus amount: ₵{settings?.bonus_amount.toFixed(2)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Bonus Amount</label>
            <Input
              type="number"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Welcome Message Settings</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Welcome Title</label>
            <Input
              value={welcomeTitle}
              onChange={(e) => setWelcomeTitle(e.target.value)}
              placeholder="Welcome title"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Welcome Message</label>
            <Textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Welcome message"
              disabled={isSubmitting}
              rows={4}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Settings"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default SignupBonusSettings;