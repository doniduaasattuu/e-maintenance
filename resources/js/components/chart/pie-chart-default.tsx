/* eslint-disable @typescript-eslint/no-explicit-any */

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Props {
    title: string;
    description: string;

    withSelect?: boolean;

    availableMonths?: {
        label: string;
        value: string;
    }[];
    selectedMonth?: string;

    onSelectChange?: (value: string) => void;
    chartData: any[];

    labelKey: string;

    valueKey: string;
}

export function ChartPieDefault({
    title,
    description,
    chartData,
    labelKey,
    valueKey,
    withSelect = false,
    availableMonths,
    selectedMonth,
    onSelectChange,
}: Props) {
    const chartConfig = chartData.reduce((acc, item) => {
        acc[item[labelKey]] = {
            label: item[labelKey],
            color: item.fill,
        };

        return acc;
    }, {} as ChartConfig);

    return (
        <Card className="bg-sidebar">
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
                <ChartContainer config={chartConfig} className="mx-auto h-105 w-full sm:h-auto">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />

                        <Pie data={chartData} dataKey={valueKey} label>
                            {/* <LabelList
                                dataKey={labelKey}
                                className="fill-background"
                                stroke="none"
                                fontSize={10}
                                formatter={(value: string) => value.split('-').pop()}
                            /> */}
                        </Pie>

                        <ChartLegend
                            content={<ChartLegendContent nameKey="label" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
