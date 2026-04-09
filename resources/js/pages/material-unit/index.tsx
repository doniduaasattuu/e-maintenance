import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { MaterialUnit, Meta, type BreadcrumbItem } from '@/types';
import TableMaterialUnit from '../../components/tables/table-material-unit';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.MATERIAL_UNIT?.plural ?? 'Material Units',
        href: route('material-units.index'),
    },
];

interface UnitIndexProps {
    materialUnits: {
        data: MaterialUnit[];
        meta: Meta;
    };
}

export default function MaterialUnitIndex({ materialUnits }: UnitIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'MATERIAL_UNIT'} className="md:max-w-2xl">
                <TableMaterialUnit materialUnits={materialUnits} />
            </TableLayout>
        </AppLayout>
    );
}
