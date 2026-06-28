/* eslint-disable @typescript-eslint/no-explicit-any */

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface StackSeries {
    key: string;
    label: string;
    color: string;
}

interface Props {
    title: string;
    description: string;

    chartData: any[];

    series: StackSeries[];

    withSelect?: boolean;

    availableMonths?: {
        label: string;
        value: string;
    }[];

    selectedMonth?: string;

    onSelectChange?: (value: string) => void;
}

export function ChartBarStackedDefault({
    title,
    description,
    chartData,
    series,
    withSelect = false,
    availableMonths,
    selectedMonth,
    onSelectChange,
}: Props) {
    const chartConfig = series.reduce((acc, item) => {
        acc[item.key] = {
            label: item.label,
            color: item.color,
        };

        return acc;
    }, {} as ChartConfig);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b py-5">
                <div className="grid flex-1 gap-1">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
                </div>
                {withSelect && (
                    <Select value={selectedMonth} onValueChange={onSelectChange}>
                        <SelectTrigger className="w-30 rounded-lg sm:ml-auto sm:flex sm:w-40" aria-label="Select a value">
                            <SelectValue placeholder="--Select--" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {availableMonths?.map((e) => (
                                <SelectItem value={e.value} className="rounded-lg">
                                    {e.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />

                        <XAxis dataKey="week" tickLine={false} axisLine={false} />

                        <ChartTooltip content={<ChartTooltipContent />} />

                        <ChartLegend content={<ChartLegendContent />} />

                        {series.map((item, index) => (
                            <Bar
                                key={item.key}
                                dataKey={item.key}
                                stackId="stack"
                                fill={`var(--color-${item.key})`}
                                radius={index === 0 ? [0, 0, 4, 4] : index === series.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
