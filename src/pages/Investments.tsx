import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, Clock } from "lucide-react";

const Investments = () => {
  const packages = [
    {
      name: "Starter Package",
      minAmount: "1,000",
      maxAmount: "5,000",
      duration: "3 months",
      returns: "8%",
      risk: "Low",
    },
    {
      name: "Growth Package",
      minAmount: "5,000",
      maxAmount: "20,000",
      duration: "6 months",
      returns: "15%",
      risk: "Medium",
    },
    {
      name: "Premium Package",
      minAmount: "20,000",
      maxAmount: "100,000",
      duration: "12 months",
      returns: "25%",
      risk: "High",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Investment Packages</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <Card key={index} className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Returns: {pkg.returns}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2" />
                <span>Risk Level: {pkg.risk}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Duration: {pkg.duration}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Min: ${pkg.minAmount} - Max: ${pkg.maxAmount}
              </p>
            </div>

            <Button className="w-full">Invest Now</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Investments;