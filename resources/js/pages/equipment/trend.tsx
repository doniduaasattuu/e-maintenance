import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment } from '@/types';
import { Head } from '@inertiajs/react';

interface EquipmentTrendProps {
    equipment: {
        data: Equipment;
    };
    trendData: Record<string, unknown>;
    filters: {
        date_range: {
            from: string;
            to: string;
        };
    };
    chartConfig: Record<string, unknown>;
}

export default function EquipmentTrend({ equipment, trendData, filters, chartConfig }: EquipmentTrendProps) {
    const strings = UI_STRINGS;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.EQUIPMENT?.plural ?? 'Equipments',
            href: route('equipments.index'),
        },
        {
            title: equipment.data.code,
            href: route('equipments.index', equipment.data.id),
        },
    ];

    console.log('Equipment:', equipment);
    console.log('Trend Data:', trendData);
    console.log('Chart Config:', chartConfig);
    console.log('Filters:', filters);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trend" />

            <EquipmentLayout equipment={equipment.data} className="w-full max-w-7xl">
                <div className="space-y-6">
                    <div className="flex items-center justify-between gap-2">
                        <HeadingSmall
                            title="Trend"
                            description="Visualization of historical inspection parameter data to facilitate performance analysis and early detection of equipment anomalies."
                        />
                    </div>
                    {/* Render your trend chart here using trendData and chartConfig */}
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
