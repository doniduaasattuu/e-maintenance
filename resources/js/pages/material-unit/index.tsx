import AppLayout from '@/layouts/app-layout';
import { MaterialUnit, Meta, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import TableMaterialUnit from '../../components/tables/table-material-unit';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Material Units',
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
            <Head title="Material Unit" />

            <TableMaterialUnit materialUnits={materialUnits} />
        </AppLayout>
    );
}
