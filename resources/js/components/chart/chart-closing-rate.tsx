import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ClosingRateItem {
    code?: string;
    name: string;
    totalFindings: number;
    closedFindings: number;
    closingRate: number;
}

interface Props {
    title: string;
    description: string;

    chartData: ClosingRateItem[];

    withSelect?: boolean;

    availableMonths?: {
        label: string;
        value: string;
    }[];

    selectedMonth?: string;

    onSelectChange?: (value: string) => void;
}

export function ClosingRateCard({ title, description, chartData, withSelect = false, availableMonths, selectedMonth, onSelectChange }: Props) {
    function getStatus(rate: number) {
        if (rate >= 90)
            return {
                label: 'Excellent',
                color: 'text-green-600',
                progress: '[&>div]:bg-green-600',
            };

        if (rate >= 70)
            return {
                label: 'Good',
                color: 'text-blue-600',
                progress: '[&>div]:bg-blue-600',
            };

        if (rate >= 50)
            return {
                label: 'Warning',
                color: 'text-yellow-600',
                progress: '[&>div]:bg-yellow-500',
            };

        return {
            label: 'Poor',
            color: 'text-red-600',
            progress: '[&>div]:bg-red-600',
        };
    }

    return (
        <Card className="bg-sidebar space-y-4">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b py-5">
                <div className="grid flex-1 gap-1">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>

                    <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
                </div>

                {withSelect && (
                    <Select value={selectedMonth} onValueChange={onSelectChange}>
                        <SelectTrigger className="w-30 rounded-lg sm:ml-auto sm:flex sm:w-40">
                            <SelectValue placeholder="--Select--" />
                        </SelectTrigger>

                        <SelectContent>
                            {availableMonths?.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {chartData.map((item) => {
                    const status = getStatus(item.closingRate);

                    return (
                        <div key={item.code ?? item.name} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span>{item.name}</span>
                                <span>{item.closingRate}%</span>
                            </div>

                            <Progress value={item.closingRate} className={cn(status.progress, 'h-2')} />

                            <div className="text-muted-foreground flex justify-between text-xs">
                                <span>
                                    {item.closedFindings} / {item.totalFindings} Closed
                                </span>

                                <span>{item.totalFindings} Findings</span>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
