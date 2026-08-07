import { Progress } from '../ui/progress';

export type PlantProgressProps = {
    plant: string;
    closedFindings: number;
    totalPlantFinding: number;
    closingRate: number;
    totalFinding: number;
    singlePlant?: boolean;
};

export default function PlantProgress({ plant, closedFindings, totalPlantFinding, closingRate, totalFinding }: PlantProgressProps) {
    const findingPercentage = Number(((totalPlantFinding / totalFinding) * 100).toFixed(1));

    return (
        <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-semibold">{plant}</div>
                <div className="text-sm font-semibold">{findingPercentage}%</div>
            </div>
            <Progress className="h-2 sm:h-3" value={closingRate} />
            <div className="text-muted-foreground flex justify-between text-xs">
                <span>
                    {closedFindings} / {totalPlantFinding} Closed
                </span>
                <span>{closingRate}% Closed</span>
            </div>
        </div>
    );
}
