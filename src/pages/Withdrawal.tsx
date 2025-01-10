import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Withdrawal = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phoneNumber: "",
    network: "",
    accountName: "",
    amount: "",
  });

  // Fetch withdrawal settings
  const { data: withdrawalSettings } = useQuery({
    queryKey: ['withdrawal-settings'],
    queryFn: async () => {
      console.log('Fetching withdrawal settings...');
      const { data, error } = await supabase
        .from('withdrawal_settings')
        .select('*');
      
      if (error) {
        console.error('Error fetching withdrawal settings:', error);
        throw error;
      }
      console.log('Fetched withdrawal settings:', data);
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Find selected network settings
      const networkSettings = withdrawalSettings?.find(
        setting => setting.network.toLowerCase() === formData.network.toLowerCase()
      );

      if (!networkSettings) {
        toast({
          title: "Network Error",
          description: "Selected network is not available",
          variant: "destructive",
        });
        return;
      }

      // Check if network is disabled
      if (!networkSettings.is_active) {
        toast({
          title: "Network Unavailable",
          description: `We are currently not offering withdrawal services for ${networkSettings.network}`,
          variant: "destructive",
        });
        return;
      }

      // Check minimum amount
      const withdrawalAmount = parseFloat(formData.amount);
      if (withdrawalAmount < networkSettings.minimum_amount) {
        toast({
          title: "Invalid Amount",
          description: `Minimum withdrawal amount for ${networkSettings.network} is ₵${networkSettings.minimum_amount}`,
          variant: "destructive",
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check user's balance
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      if (!profile || profile.balance < withdrawalAmount) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough balance for this withdrawal",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'withdrawal',
          amount: withdrawalAmount,
          account_name: formData.accountName,
          phone_number: formData.phoneNumber,
          network: formData.network,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Withdrawal request submitted successfully. Awaiting admin approval.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Request Withdrawal</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="network">Network</Label>
            <Select
              value={formData.network}
              onValueChange={(value) =>
                setFormData({ ...formData, network: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {withdrawalSettings?.filter(setting => setting.is_active).map((setting) => (
                  <SelectItem key={setting.id} value={setting.network.toLowerCase()}>
                    {setting.network}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accountName">Name on Account</Label>
            <Input
              id="accountName"
              value={formData.accountName}
              onChange={(e) =>
                setFormData({ ...formData, accountName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Withdrawal Amount (₵)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
            {formData.network && withdrawalSettings && (
              <p className="text-sm text-gray-500 mt-1">
                Minimum withdrawal: ₵
                {withdrawalSettings.find(
                  setting => setting.network.toLowerCase() === formData.network.toLowerCase()
                )?.minimum_amount || 0}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit Withdrawal Request
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Withdrawal;