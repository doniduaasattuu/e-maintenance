import TableEquipmentType from '@/components/tables/table-equipment-type';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, EquipmentType, Meta } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.EQUIPMENT_TYPE?.plural ?? 'Equipment Types',
        href: route('equipment-types.index'),
    },
];

interface EquipmentTypeProps {
    equipmentTypes: {
        data: EquipmentType[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function EquipmentTypeIndex({ equipmentTypes, filters }: EquipmentTypeProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'EQUIPMENT_TYPE'} className="md:max-w-7xl">
                <TableEquipmentType equipmentTypes={equipmentTypes} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
