import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const SignupBonusSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newAmount, setNewAmount] = useState("");
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
      console.log('Fetched signup bonus settings:', data);
      return data;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      console.log('Updating signup bonus amount:', newAmount);
      const { error } = await supabase
        .from('signup_settings')
        .update({ bonus_amount: parseFloat(newAmount) })
        .eq('id', settings?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      console.log('Successfully updated signup bonus settings');
      queryClient.invalidateQueries({ queryKey: ['signup-bonus-settings'] });
      toast({
        title: "Success",
        description: "Signup bonus amount updated successfully",
      });
      setNewAmount("");
    },
    onError: (error) => {
      console.error('Error updating signup bonus settings:', error);
      toast({
        title: "Error",
        description: "Failed to update signup bonus amount",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmount || isNaN(parseFloat(newAmount)) || parseFloat(newAmount) < 0) {
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
      <h2 className="text-xl font-semibold mb-4">Signup Bonus Settings</h2>
      <div className="mb-4">
        <p className="text-muted-foreground">
          Current signup bonus amount: ₵{settings?.bonus_amount.toFixed(2)}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Bonus Amount"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default SignupBonusSettings;