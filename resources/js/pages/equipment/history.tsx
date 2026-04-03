import HeadingSmall from '@/components/heading-small';
import TableHistory from '@/components/tables/table-history';
import AppLayout from '@/layouts/app-layout';
import EquipmentLayout from '@/layouts/equipment/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment, InstallDismantleHistory, Meta } from '@/types';
import { Head } from '@inertiajs/react';

interface EquipmentHistoryProps {
    equipment: {
        data: Equipment;
    };
    histories: {
        data: InstallDismantleHistory[];
        meta: Meta;
    };
}

export default function EquipmentHistory({ equipment, histories }: EquipmentHistoryProps) {
    const strings = UI_STRINGS;
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: strings.EQUIPMENT?.plural ?? 'Equipments',
            href: route('equipments.index'),
        },
        {
            title: equipment.data.code,
            href: route('equipments.show', equipment.data.id),
        },
        {
            title: 'History',
            href: `/equipments/${equipment.data.id}/history`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History" />

            <EquipmentLayout equipment={equipment.data} className="w-full max-w-6xl">
                <div className="space-y-6">
                    <HeadingSmall
                        title="History"
                        description="Installation and dismantle history for this equipment, including status and location changes."
                    />
                    <TableHistory histories={histories} />
                </div>
            </EquipmentLayout>
        </AppLayout>
    );
}
