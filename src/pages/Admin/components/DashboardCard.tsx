import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  className?: string;
  children: React.ReactNode;
}

const DashboardCard = ({ className, children }: DashboardCardProps) => {
  return (
    <Card className={cn("p-6 shadow-sm", className)}>
      {children}
    </Card>
  );
};

export default DashboardCard;