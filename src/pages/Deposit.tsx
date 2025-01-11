import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Deposit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    phoneNumber: "",
    transactionId: "",
    amount: "",
  });

  const { data: paymentSettings, isLoading } = useQuery({
    queryKey: ['payment-settings'],
    queryFn: async () => {
      console.log('Fetching payment settings...');
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching payment settings:', error);
        throw error;
      }
      console.log('Fetched payment settings:', data);
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) {
      toast({
        title: "Error",
        description: "Please select an amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: parseFloat(formData.amount),
          account_name: formData.accountName,
          phone_number: formData.phoneNumber,
          transaction_id: formData.transactionId,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deposit request submitted successfully. Awaiting admin approval.",
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting deposit:', error);
      toast({
        title: "Error",
        description: "Failed to submit deposit request",
        variant: "destructive",
      });
    }
  };

  const amounts = [50, 100, 250, 500, 1000, 2500, 4000, 5000];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Make a Deposit</h1>

      <Card className="p-6 space-y-6">
        {paymentSettings && paymentSettings.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <p className="text-sm text-blue-800 font-medium">Payment Instructions</p>
            <p className="text-sm text-blue-700">
              Send the exact amount to any of the accounts below:
            </p>
            {paymentSettings.map((setting) => (
              <div key={setting.id} className="space-y-1">
                <p className="text-sm text-blue-900 font-medium">{setting.network}</p>
                <p className="text-sm text-blue-900 font-medium">{setting.account_number}</p>
                <p className="text-sm text-blue-900 font-medium">{setting.account_name}</p>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
              <Label htmlFor="email">Email used in sign-up</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

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
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={formData.transactionId}
                onChange={(e) =>
                  setFormData({ ...formData, transactionId: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Select Amount (₵)</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setFormData({ ...formData, amount: value })
                }
                className="grid grid-cols-2 gap-4"
              >
                {amounts.map((amount) => (
                  <div
                    key={amount}
                    className="flex items-center space-x-2 border rounded-lg p-4"
                  >
                    <RadioGroupItem value={amount.toString()} id={`amount-${amount}`} />
                    <Label htmlFor={`amount-${amount}`}>₵{amount.toLocaleString()}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Submit Deposit Request
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Deposit;