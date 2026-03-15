import TableEquipmentClass from '@/components/tables/table-equipment-class';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, EquipmentClass, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.EQUIPMENT_CLASS?.plural ?? 'Equipment Classes',
        href: route('equipment-classes.index'),
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
