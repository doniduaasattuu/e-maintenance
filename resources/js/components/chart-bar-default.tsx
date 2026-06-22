/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Interface sekarang lebih fleksibel menggunakan generic atau record
interface ChartProps {
    withSelect?: boolean;
    title: string;
    description: string;
    chartData: any[]; // Data array dari backend
    labelKey: string; // Contoh: "departmentCode" atau "name"
    valueKey: string; // Contoh: "totalClosedFindings" atau "totalSolved"
    chartColor?: string; // Opsional: warna bar
    availableMonths?: {
        label: string;
        value: string;
    }[];
    selectedMonth?: string;
    onSelectChange?: (value: any) => void;
    xAxisAngle?: number;
}

export function ChartBarDefault({
    withSelect = false,
    title,
    description,
    chartData,
    labelKey,
    valueKey,
    chartColor = 'var(--chart-1)',
    availableMonths,
    selectedMonth,
    onSelectChange,
    xAxisAngle = undefined,
}: ChartProps) {
    // Konfigurasi dinamis berdasarkan valueKey yang dikirim
    const chartConfig = {
        [valueKey]: {
            label: 'Total',
            color: chartColor,
        },
    } satisfies ChartConfig;
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
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 40, bottom: 10 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            angle={xAxisAngle}
                            dataKey={labelKey}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.toString().slice(0, 5)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey={valueKey} fill={chartColor} radius={8}>
                            <LabelList position="top" offset={12} className="fill-foreground font-medium" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
