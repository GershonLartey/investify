import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Calendar } from "lucide-react";

interface InvestmentTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvestmentTrackingModal = ({ open, onOpenChange }: InvestmentTrackingModalProps) => {
  const { data: activeInvestments } = useQuery({
    queryKey: ['active-investments'],
    queryFn: async () => {
      console.log('Fetching active investments...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;
      console.log('Active investments:', data);
      return data;
    },
  });

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const calculateRemainingDays = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    return Math.max(Math.ceil((end - now) / (1000 * 60 * 60 * 24)), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Active Investments</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {activeInvestments?.map((investment) => (
            <div key={investment.id} className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="font-semibold">₵{investment.amount.toFixed(2)}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    {investment.daily_interest}% Daily Return
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {calculateRemainingDays(investment.end_date)} days remaining
                  </div>
                </div>
              </div>
              <Progress value={calculateProgress(investment.start_date, investment.end_date)} />
            </div>
          ))}
          {(!activeInvestments || activeInvestments.length === 0) && (
            <p className="text-center text-muted-foreground">No active investments found</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvestmentTrackingModal;