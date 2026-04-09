import TableMaterialType from '@/components/tables/table-material-type';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { MaterialType, Meta, type BreadcrumbItem } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.MATERIAL_TYPE?.plural ?? 'Material Types',
        href: route('material-types.index'),
    },
];

interface MaterialTypeIndexProps {
    materialTypes: {
        data: MaterialType[];
        meta: Meta;
    };
}

export default function MaterialTypeIndex({ materialTypes }: MaterialTypeIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'MATERIAL_TYPE'} className="md:max-w-4xl">
                <TableMaterialType materialTypes={materialTypes} />
            </TableLayout>
        </AppLayout>
    );
}
