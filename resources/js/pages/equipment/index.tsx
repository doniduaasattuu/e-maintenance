import TableEquipment from '@/components/tables/table-equipment';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Equipment, EquipmentClass, EquipmentStatus, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.EQUIPMENT?.plural ?? 'Equipments',
        href: route('equipments.index'),
    },
];

type EquipmentProps = {
    equipments: {
        data: Equipment[];
        meta: Meta;
    };
    equipmentClasses: {
        data: EquipmentClass[];
    };
    equipmentStatuses: {
        data: EquipmentStatus[];
    };
    filters: {
        query: string;
        per_page: string;
    };
};

export default function EquipmentIndex({ equipments, equipmentClasses, equipmentStatuses, filters }: EquipmentProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'EQUIPMENT'} className="md:max-w-7xl">
                <TableEquipment equipments={equipments} equipmentClasses={equipmentClasses} equipmentStatuses={equipmentStatuses} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
