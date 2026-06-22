import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface Props {
    chartData: Array<Record<string, unknown>>;
    chartConfig: ChartConfig;
    xAxisKey?: string;
    yAxisLabel?: string;
    title?: string;
    description?: string;
}

export function DynamicLineChart({ title, description, chartData, chartConfig, xAxisKey = 'Date', yAxisLabel }: Props) {
    const activeDataKeys = Object.keys(chartConfig).filter((key) => key !== xAxisKey);

    return (
        <Card className="flex h-100 flex-col overflow-hidden ps-2 pb-4">
            <CardHeader className="mb-0 space-y-0">
                {title && <CardTitle className="text-lg">{title}</CardTitle>}
                {description && <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>}
            </CardHeader>
            <CardContent className="min-h-0 flex-1 p-0">
                <ChartContainer config={chartConfig} className="h-full w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 24,
                            left: 12,
                            right: 24,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis angle={-45} dataKey={xAxisKey} tickLine={false} axisLine={false} tickMargin={4} />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            orientation="left"
                            label={{
                                value: yAxisLabel ?? 'Value',
                                angle: -90,
                                position: 'insideLeft',
                                offset: 0,
                                style: { textAnchor: 'middle' },
                            }}
                        />
                        <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />

                        {activeDataKeys.map((key) => (
                            <Line
                                key={key}
                                dataKey={key}
                                type="monotone"
                                stroke={`var(--color-${key})`}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{
                                    r: 4,
                                }}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
