/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

// Interface sekarang lebih fleksibel menggunakan generic atau record
interface ChartProps {
    title: string;
    description: string;
    chartData: any[]; // Data array dari backend
    labelKey: string; // Contoh: "departmentCode" atau "name"
    valueKey: string; // Contoh: "totalClosedFindings" atau "totalSolved"
    chartColor?: string; // Opsional: warna bar
}

export function ChartBarDefault({ title, description, chartData, labelKey, valueKey, chartColor = 'var(--chart-1)' }: ChartProps) {
    // Konfigurasi dinamis berdasarkan valueKey yang dikirim
    const chartConfig = {
        [valueKey]: {
            label: 'Total',
            color: chartColor,
        },
    } satisfies ChartConfig;
    // const [timeRange, setTimeRange] = useState('90d');

    return (
        <Card className="bg-sidebar">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">{description}</CardDescription>
                </div>
                {/* <Select disabled value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="hidden w-40 rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select> */}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
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
