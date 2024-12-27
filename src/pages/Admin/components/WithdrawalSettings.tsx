import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const WithdrawalSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newNetwork, setNewNetwork] = useState("");
  const [newMinAmount, setNewMinAmount] = useState("");

  const { data: settings } = useQuery({
    queryKey: ['withdrawal-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawal_settings')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const addSettingMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('withdrawal_settings')
        .insert({
          network: newNetwork,
          minimum_amount: parseFloat(newMinAmount),
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal-settings'] });
      setNewNetwork("");
      setNewMinAmount("");
      toast({
        title: "Success",
        description: "Withdrawal setting added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add withdrawal setting",
        variant: "destructive",
      });
    },
  });

  const toggleSettingMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => {
      const { error } = await supabase
        .from('withdrawal_settings')
        .update({ is_active: isActive })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawal-settings'] });
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    },
    onError: () => {
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
    addSettingMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Withdrawal Settings</h2>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Network</label>
              <Input
                value={newNetwork}
                onChange={(e) => setNewNetwork(e.target.value)}
                placeholder="e.g., MTN Mobile Money"
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
              />
            </div>
          </div>
          <Button type="submit">Add Network</Button>
        </form>
      </Card>

      <Card className="p-6">
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
                <TableCell>{setting.network}</TableCell>
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
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default WithdrawalSettings;