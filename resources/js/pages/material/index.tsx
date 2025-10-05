import TableMaterial from '@/components/tables/table-material';
import AppLayout from '@/layouts/app-layout';
import { Material, Meta, type BreadcrumbItem } from '@/types';
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
}

export default function MaterialIndex({ materials }: MaterialIndexProps) {
    console.log(materials);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Material" />

            <TableMaterial materials={materials} />
        </AppLayout>
    );
}
