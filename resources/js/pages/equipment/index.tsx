import TableEquipment from '@/components/tables/table-equipment';
import AppLayout from '@/layouts/app-layout';
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
};

export default function EquipmentIndex({ equipments, equipmentClasses, equipmentStatuses }: EquipmentProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableEquipment equipments={equipments} equipmentClasses={equipmentClasses} equipmentStatuses={equipmentStatuses} />
        </AppLayout>
    );
}
