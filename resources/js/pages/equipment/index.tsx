import TableEquipment from '@/components/tables/table-equipment';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Equipment, EquipmentClass, EquipmentStatus, Meta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipments',
        href: '/equipments',
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
