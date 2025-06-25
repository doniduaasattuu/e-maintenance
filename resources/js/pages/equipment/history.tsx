import TableHistory from '@/components/tables/table-history';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { BreadcrumbItem, Equipment, InstallDismantleHistory, Meta } from '@/types';

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
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Equipments',
            href: '/equipments',
        },
        {
            title: equipment.data.code,
            href: `/equipments/${equipment.data.id}`,
        },
        {
            title: 'History',
            href: `/equipments/${equipment.data.id}/history`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout
                title="Equipments"
                description="Installation and dismantle history for this equipment, including status and location changes"
            >
                <TableHistory histories={histories} />
            </TableLayout>
        </AppLayout>
    );
}
