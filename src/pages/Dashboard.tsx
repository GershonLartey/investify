import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Investments</h3>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Returns</h3>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/deposit">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-medium text-gray-900">Make a Deposit</h3>
            <p className="text-gray-500">Add funds to your investment account</p>
          </Card>
        </Link>
        <Link to="/withdrawal">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <h3 className="text-lg font-medium text-gray-900">Request Withdrawal</h3>
            <p className="text-gray-500">Withdraw funds from your account</p>
          </Card>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="text-center text-gray-500 py-8">
          No recent transactions
        </div>
      </div>
    </div>
  );
};

export default Dashboard;