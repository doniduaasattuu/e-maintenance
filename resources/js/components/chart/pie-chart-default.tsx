/* eslint-disable @typescript-eslint/no-explicit-any */

import { LabelList, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface Props {
    title: string;
    description: string;

    chartData: any[];

    labelKey: string;

    valueKey: string;
}

export function ChartPieDefault({ title, description, chartData, labelKey, valueKey }: Props) {
    const chartConfig = chartData.reduce((acc, item) => {
        acc[item[labelKey]] = {
            label: item[labelKey],
            color: item.fill,
        };

        return acc;
    }, {} as ChartConfig);

    return (
        <Card className="bg-sidebar">
            <CardHeader>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto">
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent nameKey={valueKey} hideLabel />} />

                        <Pie data={chartData} dataKey={valueKey} nameKey={labelKey}>
                            <LabelList
                                dataKey={labelKey}
                                className="fill-background"
                                stroke="none"
                                fontSize={10}
                                formatter={(value: string) => value.split('-').pop()}
                            />
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
