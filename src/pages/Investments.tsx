import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Investments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Fetch user's balance
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Create investment mutation
  const createInvestmentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14); // 14 days from now

      const { data, error } = await supabase
        .from("investments")
        .insert({
          amount,
          user_id: user.id,
          end_date: endDate.toISOString(),
          daily_interest: 10, // 10% daily interest
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Success",
        description: "Investment package purchased successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to purchase investment package",
        variant: "destructive",
      });
    },
  });

  const handleInvest = (amount: number) => {
    if (!profile) {
      toast({
        title: "Error",
        description: "Please log in to invest",
        variant: "destructive",
      });
      return;
    }

    if (profile.balance < amount) {
      toast({
        title: "Insufficient balance",
        description: "Please deposit more funds to invest in this package",
        variant: "destructive",
      });
      return;
    }

    createInvestmentMutation.mutate(amount);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Investment Packages</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg, index) => (
          <Card key={index} className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{pkg.label}</h3>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Returns: 10% Daily</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2" />
                <span>Duration: 14 Days</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Total Return: 140%</span>
              </div>
            </div>

            <Button 
              className="w-full"
              onClick={() => handleInvest(pkg.amount)}
              disabled={!profile || profile.balance < pkg.amount}
            >
              {!profile ? "Login to Invest" : 
               profile.balance < pkg.amount ? "Insufficient Balance" : 
               "Invest Now"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Investments;