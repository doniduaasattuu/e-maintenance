import TableMaterial from '@/components/tables/table-material';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { Material, MaterialType, MaterialUnit, Meta, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.MATERIAL?.plural ?? 'Materials',
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
