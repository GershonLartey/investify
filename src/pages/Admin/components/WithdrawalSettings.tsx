import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const WithdrawalSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newNetwork, setNewNetwork] = useState("");
  const [newMinAmount, setNewMinAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['withdrawal-settings'],
    queryFn: async () => {
      console.log('Fetching withdrawal settings...');
      const { data, error } = await supabase
        .from('withdrawal_settings')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching withdrawal settings:', error);
        throw error;
      }
      console.log('Fetched withdrawal settings:', data);
      return data;
    },
  });

  const addSettingMutation = useMutation({
    mutationFn: async () => {
      setIsSubmitting(true);
      console.log('Adding new withdrawal setting:', { network: newNetwork, minimum_amount: newMinAmount });
      const { error } = await supabase
        .from('withdrawal_settings')
        .insert({
          network: newNetwork,
          minimum_amount: parseFloat(newMinAmount),
          is_active: true
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      console.log('Successfully added withdrawal setting');
      queryClient.invalidateQueries({ queryKey: ['withdrawal-settings'] });
      setNewNetwork("");
      setNewMinAmount("");
      toast({
        title: "Success",
        description: "Withdrawal setting added successfully",
      });
    },
    onError: (error) => {
      console.error('Error adding withdrawal setting:', error);
      toast({
        title: "Error",
        description: "Failed to add withdrawal setting",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const toggleSettingMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      console.log('Toggling withdrawal setting:', { id, isActive });
      const { error } = await supabase
        .from('withdrawal_settings')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      console.log('Successfully updated withdrawal setting');
      queryClient.invalidateQueries({ queryKey: ['withdrawal-settings'] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating withdrawal setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNetwork || !newMinAmount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(parseFloat(newMinAmount)) || parseFloat(newMinAmount) < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid minimum amount",
        variant: "destructive",
      });
      return;
    }

    addSettingMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load withdrawal settings. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Network</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Network Name</label>
              <Input
                value={newNetwork}
                onChange={(e) => setNewNetwork(e.target.value)}
                placeholder="e.g., MTN Mobile Money"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Amount</label>
              <Input
                type="number"
                value={newMinAmount}
                onChange={(e) => setNewMinAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Network"
            )}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Network Settings</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Network</TableHead>
              <TableHead>Minimum Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings?.map((setting) => (
              <TableRow key={setting.id}>
                <TableCell className="font-medium">{setting.network}</TableCell>
                <TableCell>₵{setting.minimum_amount.toFixed(2)}</TableCell>
                <TableCell>{setting.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <Switch
                    checked={setting.is_active}
                    onCheckedChange={(checked) => 
                      toggleSettingMutation.mutate({ id: setting.id, isActive: checked })
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
            {(!settings || settings.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No networks configured
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default WithdrawalSettings;