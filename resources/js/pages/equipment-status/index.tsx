import TableEquipmentStatus from '@/components/tables/table-equipment-status';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, EquipmentStatus, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.EQUIPMENT_STATUS?.plural ?? 'Equipment Statuses',
        href: route('equipment-statuses.index'),
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
