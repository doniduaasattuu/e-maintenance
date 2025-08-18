import TableEquipmentStatus from '@/components/tables/table-equipment-status';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EquipmentStatus, Meta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipment Statuses',
        href: '/equipment-statuses',
    },
];

interface EquipmentStatusProps {
    equipmentStatuses: {
        data: EquipmentStatus[];
        meta: Meta;
    };
}

export default function EquipmentStatusIndex({ equipmentStatuses }: EquipmentStatusProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableEquipmentStatus equipmentStatuses={equipmentStatuses} />
        </AppLayout>
    );
}
