import { Progress } from "@/components/ui/progress";

interface EnergyMeterProps {
  energy: number;
  isMobile?: boolean;
}

export default function EnergyMeter({ energy, isMobile = false }: EnergyMeterProps) {
  if (isMobile) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-neutral-600 font-medium">Énergie Quotidienne</span>
          <span className="text-secondary font-bold">{energy}%</span>
        </div>
        <Progress 
          value={energy} 
          variant="energy"
          className="h-4 bg-neutral-200 rounded-full overflow-hidden"
        />
      </div>
    );
  }

  return (
    <div className="mr-2">
      <span className="text-white text-sm font-medium">Énergie</span>
      <div className="w-32 h-4 bg-primary-dark rounded-full overflow-hidden">
        <Progress 
          value={energy} 
          variant="energy"
          className="h-full rounded-full" 
        />
      </div>
      <div className="text-white text-lg font-bold">{energy}%</div>
    </div>
  );
}
