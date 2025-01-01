import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import InvestmentPackage from "./Investments/components/InvestmentPackage";
import InvestmentTrackingModal from "./Investments/components/InvestmentTrackingModal";

const Investments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  const packages = [
    { amount: 50, label: "₵50" },
    { amount: 100, label: "₵100" },
    { amount: 250, label: "₵250" },
    { amount: 500, label: "₵500" },
    { amount: 1000, label: "₵1,000" },
    { amount: 2500, label: "₵2,500" },
    { amount: 4000, label: "₵4,000" },
    { amount: 5000, label: "₵5,000" },
  ];

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-investments-data"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const [profileResult, investmentsResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("balance")
          .eq("id", user.id)
          .single(),
        supabase
          .from("investments")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active"),
      ]);

      if (profileResult.error) throw profileResult.error;
      if (investmentsResult.error) throw investmentsResult.error;

      return {
        profile: profileResult.data,
        investments: investmentsResult.data,
      };
    },
  });

  const createInvestmentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14);

      const { data: investment, error: investmentError } = await supabase
        .from("investments")
        .insert({
          amount,
          user_id: user.id,
          end_date: endDate.toISOString(),
          daily_interest: 10,
        })
        .select()
        .single();
      
      if (investmentError) throw investmentError;

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: 'investment',
          amount: amount,
          status: 'approved'
        });

      if (transactionError) throw transactionError;

      const { error: balanceError } = await supabase
        .from("profiles")
        .update({ balance: userData?.profile?.balance - amount })
        .eq('id', user.id);

      if (balanceError) throw balanceError;

      return investment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-investments-data"] });
      toast({
        title: "Success",
        description: "Investment package purchased successfully",
      });
    },
    onError: (error) => {
      console.error('Investment error:', error);
      toast({
        title: "Error",
        description: "Failed to purchase investment package",
        variant: "destructive",
      });
    },
  });

  const handleInvest = (amount: number) => {
    if (!userData?.profile) {
      toast({
        title: "Error",
        description: "Please log in to invest",
        variant: "destructive",
      });
      return;
    }

    if (userData.profile.balance < amount) {
      toast({
        title: "Insufficient balance",
        description: "Please deposit more funds to invest in this package",
        variant: "destructive",
      });
      return;
    }

    createInvestmentMutation.mutate(amount);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Investment Packages</h1>
        <Button 
          variant="outline"
          onClick={() => setTrackingModalOpen(true)}
          className="gap-2"
        >
          <Activity className="h-4 w-4" />
          Check Active Investments
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Total Invested</h3>
          <p className="text-2xl font-bold">
            ₵{(userData?.investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0).toFixed(2)}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Expected Returns</h3>
          <p className="text-2xl font-bold">
            ₵{(userData?.investments?.reduce((sum, inv) => {
              const daysRemaining = Math.ceil((new Date(inv.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              return sum + (inv.amount * (inv.daily_interest / 100) * daysRemaining);
            }, 0) || 0).toFixed(2)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg, index) => (
          <InvestmentPackage
            key={index}
            amount={pkg.amount}
            label={pkg.label}
            onInvest={handleInvest}
            disabled={userData?.profile?.balance < pkg.amount}
          />
        ))}
      </div>

      <InvestmentTrackingModal
        open={trackingModalOpen}
        onOpenChange={setTrackingModalOpen}
      />
    </div>
  );
};

export default Investments;