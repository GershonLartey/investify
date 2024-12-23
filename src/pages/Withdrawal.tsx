import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Withdrawal = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Request Withdrawal</h1>

      <Card className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount (USD)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Withdrawal Method
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          >
            <option>Bank Transfer</option>
            <option>Credit Card</option>
            <option>Cryptocurrency</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Details
          </label>
          <textarea
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            rows={3}
            placeholder="Enter your withdrawal account details..."
          />
        </div>

        <div className="pt-4">
          <Button className="w-full">Submit Withdrawal Request</Button>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Note: Withdrawals are processed within 1-3 business days
        </p>
      </Card>
    </div>
  );
};

export default Withdrawal;