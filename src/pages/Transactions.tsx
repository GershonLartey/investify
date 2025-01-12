import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import TransactionHistory from "./TransactionHistory";
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const Transactions = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" 
          onClick={() => navigate("/deposit")}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full group-hover:scale-110 transition-transform">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Deposit</h3>
              <p className="text-sm text-gray-500">Add funds to your account</p>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              Deposit Now →
            </Button>
          </div>
        </Card>

        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" 
          onClick={() => navigate("/withdrawal")}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-full group-hover:scale-110 transition-transform">
              <ArrowDownLeft className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Withdraw</h3>
              <p className="text-sm text-gray-500">Withdraw your funds</p>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              Withdraw Now →
            </Button>
          </div>
        </Card>
      </div>

      <TransactionHistory />
    </div>
  );
};

export default Transactions;