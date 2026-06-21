/* eslint-disable @typescript-eslint/no-explicit-any */
import { LabelList, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ChartProps {
    title: string;
    description: string;
    chartData: any[];
    labelKey: string;
    valueKey: string;
    chartConfig: any;
}

export function PieChartDefault({ title, description, chartData, labelKey, valueKey, chartConfig }: ChartProps) {
    return (
        <Card className="bg-sidebar flex flex-col">
            <CardHeader className="mb-2 pb-0">
                <div className="grid flex-1 gap-1">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig}>
                    <PieChart margin={{ top: 10, bottom: 10 }}>
                        <ChartTooltip content={<ChartTooltipContent nameKey={valueKey} hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey={valueKey}
                            labelLine={false}
                            // label={({ name }) => name}
                            label={({ payload, ...props }) => {
                                return (
                                    <text
                                        cx={props.cx}
                                        cy={props.cy}
                                        x={props.x}
                                        y={props.y}
                                        textAnchor={props.textAnchor}
                                        dominantBaseline={props.dominantBaseline}
                                        fill="var(--foreground)"
                                    >
                                        {payload.label}
                                    </text>
                                );
                            }}
                            nameKey={labelKey}
                        >
                            <LabelList dataKey={valueKey} position="inside" fill="white" formatter={(value: number) => value.toLocaleString()} />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
            </CardFooter> */}
        </Card>
    );
}
