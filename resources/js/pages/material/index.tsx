import TableMaterial from '@/components/tables/table-material';
import AppLayout from '@/layouts/app-layout';
import { Material, MaterialType, MaterialUnit, Meta, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Materials',
        href: route('materials.index'),
    },
];

interface MaterialIndexProps {
    materials: {
        data: Material[];
        meta: Meta;
    };
    materialUnits: {
        data: MaterialUnit[];
    };
    materialTypes: {
        data: MaterialType[];
    };
}

export default function MaterialIndex({ materials, materialUnits, materialTypes }: MaterialIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Material" />

            <TableMaterial materials={materials} materialUnits={materialUnits} materialTypes={materialTypes} />
        </AppLayout>
    );
}
