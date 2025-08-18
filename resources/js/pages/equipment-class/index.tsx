import TableEquipmentClass from '@/components/tables/table-equipment-class';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EquipmentClass, Meta } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipment Classes',
        href: '/equipment-classes',
    },
];

interface EquipmentClassProps {
    equipmentClasses: {
        data: EquipmentClass[];
        meta: Meta;
    };
}

export default function EquipmentClassIndex({ equipmentClasses }: EquipmentClassProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableEquipmentClass equipmentClasses={equipmentClasses} />
        </AppLayout>
    );
}
