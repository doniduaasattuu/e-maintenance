import TableUnit from '@/components/tables/table-unit';
import AppLayout from '@/layouts/app-layout';
import { Meta, Unit, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Unit',
        href: route('units.index'),
    },
];

interface WorkCenterIndexProps {
    units: {
        data: Unit[];
        meta: Meta;
    };
}

export default function WorkCenterIndex({ units }: WorkCenterIndexProps) {
    console.log(units);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Unit" />

            <TableUnit units={units} />
        </AppLayout>
    );
}
