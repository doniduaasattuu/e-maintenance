import TableMaterial from '@/components/tables/table-material';
import AppLayout from '@/layouts/app-layout';
import { Material, MaterialType, Meta, Unit, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material',
        href: route('materials.index'),
    },
];

interface MaterialIndexProps {
    materials: {
        data: Material[];
        meta: Meta;
    };
    units: {
        data: Unit[];
    };
    materialTypes: {
        data: MaterialType[];
    };
}

export default function MaterialIndex({ materials, units, materialTypes }: MaterialIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Material" />

            <TableMaterial materials={materials} units={units} materialTypes={materialTypes} />
        </AppLayout>
    );
}
