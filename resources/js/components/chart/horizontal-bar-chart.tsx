import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HorizontalBarItem {
    label: string;
    name: string;
    value: number;
    closedFindings: number;
    closingRate: number;
    percentage: number;
}

interface Props {
    title: string;
    description: string;

    chartData: HorizontalBarItem[];

    valueLabel?: string;

    withSelect?: boolean;

    availableMonths?: {
        label: string;
        value: string;
    }[];

    selectedMonth?: string;

    onSelectChange?: (value: string) => void;
}

export function HorizontalBarChart({
    title,
    description,
    chartData,
    valueLabel = 'Findings',
    withSelect = false,
    availableMonths,
    selectedMonth,
    onSelectChange,
}: Props) {
    return (
        <Card className="bg-sidebar">
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

            <CardContent className="space-y-5 pt-6">
                {chartData.length === 0 && <div className="text-muted-foreground py-10 text-center text-sm">No data available.</div>}

                {chartData.map((item) => {
                    // const percentage = (item.value / maxValue) * 100;

                    return (
                        <div key={item.label} className="space-y-2">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-semibold">{item.label}</div>
                                    <div className="text-muted-foreground truncate text-xs">{item.name} Closed</div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm font-semibold">{item.closedFindings + ' / ' + item.value + ' ' + valueLabel}</div>
                                    <div className="text-muted-foreground text-xs">{item.closingRate}% Closed</div>
                                </div>
                            </div>

                            <Progress className="h-2 sm:h-3" value={item.percentage} />
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}
