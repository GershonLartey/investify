import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Clock } from "lucide-react";

interface InvestmentPackageProps {
  amount: number;
  label: string;
  onInvest: (amount: number) => void;
  disabled: boolean;
}

const InvestmentPackage = ({ amount, label, onInvest, disabled }: InvestmentPackageProps) => {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">{label}</h3>
      
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
        onClick={() => onInvest(amount)}
        disabled={disabled}
      >
        {disabled ? "Insufficient Balance" : "Invest Now"}
      </Button>
    </Card>
  );
};

export default InvestmentPackage;