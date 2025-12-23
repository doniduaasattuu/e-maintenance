import TableMaterialType from '@/components/tables/table-material-type';
import AppLayout from '@/layouts/app-layout';
import { MaterialType, Meta, type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material Type',
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
            <TableMaterialType materialTypes={materialTypes} />
        </AppLayout>
    );
}
