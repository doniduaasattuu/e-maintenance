/* eslint-disable @typescript-eslint/no-explicit-any */
import ButtonExport from '@/components/button-export';
import { DynamicLineChart } from '@/components/chart/dynamic-line-chart';
import { DateRangePopover } from '@/components/date-range-popover';
import EquipmentTrendLayout from '@/layouts/trend/layout';
import { Equipment } from '@/types';

interface EquipmentTrendProps {
    equipment: {
        data: Equipment;
    };
    trends: {
        incoming: any[];
        outgoing: any[];
        cabinet: any[];
        ampere: any[];
    };
    configs: {
        temperature: any;
        cabinet: any;
        ampere: any;
    };
}

export default function PanelTrend({ equipment, trends, configs }: EquipmentTrendProps) {
    return (
        <EquipmentTrendLayout equipment={equipment}>
            <div className="flex items-center justify-between gap-2">
                <DateRangePopover />
                <ButtonExport onClick={() => (window.location.href = route('inspection.panel.export', { equipment: equipment.data.id }))} />
            </div>
            <>
                <DynamicLineChart
                    title={equipment.data.sort_field ?? 'Ampere'}
                    description="Trend current ampere module"
                    chartData={trends.ampere}
                    chartConfig={configs.ampere}
                    xAxisKey="Date"
                    yAxisLabel="Ampere (A)"
                />
                <DynamicLineChart
                    title={equipment.data.sort_field ?? 'Incoming Temperature'}
                    description="Trend temperature incoming module"
                    chartData={trends.incoming}
                    chartConfig={configs.temperature}
                    xAxisKey="Date"
                    yAxisLabel="Incoming (°C)"
                />
                <DynamicLineChart
                    title={equipment.data.sort_field ?? 'Outgoing Temperature'}
                    description="Trend temperature outgoing module"
                    chartData={trends.outgoing}
                    chartConfig={configs.temperature}
                    xAxisKey="Date"
                    yAxisLabel="Outgoing (°C)"
                />
                <DynamicLineChart
                    title={equipment.data.sort_field ?? 'Cabinet Temperature'}
                    description="Trend hotspot temperature inside cabinet"
                    chartData={trends.cabinet}
                    chartConfig={configs.cabinet}
                    xAxisKey="Date"
                    yAxisLabel="Cabinet (°C)"
                />
            </>
        </EquipmentTrendLayout>
    );
}
