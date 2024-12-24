import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const Deposit = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    accountName: "",
    email: "",
    phoneNumber: "",
    transactionId: "",
    amount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) {
      toast({
        title: "Error",
        description: "Please select an amount",
        variant: "destructive",
      });
      return;
    }
    // Handle form submission here
    console.log("Form submitted:", formData);
    toast({
      title: "Success",
      description: "Deposit request submitted successfully",
    });
  };

  const amounts = [50, 100, 250, 500, 1000, 2500, 4000, 5000];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Make a Deposit</h1>

      <Card className="p-6 space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg space-y-2">
          <p className="text-sm text-blue-800 font-medium">Payment Instructions</p>
          <p className="text-sm text-blue-700">
            Send the exact amount to the account below:
          </p>
          <p className="text-sm text-blue-900 font-medium">05xxxxxxxx</p>
          <p className="text-sm text-blue-900 font-medium">John Doe</p>
        </div>

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