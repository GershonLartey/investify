import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import DashboardCard from "./DashboardCard";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  prefix?: string;
}

const MetricsCard = ({ title, value, change, prefix = "$" }: MetricsCardProps) => {
  return (
    <DashboardCard>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className={`flex items-center text-sm ${
              change.type === 'increase' ? 'text-green-500' : 'text-red-500'
            }`}>
              {change.type === 'increase' ? (
                <ArrowUpIcon className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 mr-1" />
              )}
              <span>{change.value}%</span>
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};

export default MetricsCard;