import HeadingSmall from '@/components/heading-small';
import usePermissions from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment } from '@/types';
import { Head } from '@inertiajs/react';

interface EquipmentTrendProps {
    equipment: {
        data: Equipment;
    };
    trendData: Record<string, unknown>; // Define the type based on your trend data structure
    filters: {
        date_range: {
            from: string;
            to: string;
        };
    }; // Define the type based on your filters structure
    chartConfig: Record<string, unknown>; // Define the type based on your chart configuration structure
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

    const { can } = usePermissions();
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
                        <HeadingSmall title="Trend" description="Equipment trend data and information." />
                    </div>
                    {/* Render your trend chart here using trendData and chartConfig */}
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
