import TableEquipmentStatus from '@/components/tables/table-equipment-status';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
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
    filters: {
        query: string;
        per_page: string;
    };
}

export default function EquipmentStatusIndex({ equipmentStatuses, filters }: EquipmentStatusProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'EQUIPMENT_STATUS'} className="md:max-w-7xl">
                <TableEquipmentStatus equipmentStatuses={equipmentStatuses} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
