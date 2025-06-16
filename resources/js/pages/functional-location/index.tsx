import TableFunctionalLocation from '@/components/table-functional-location';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, FunctionalLocation, Meta } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Functional Location',
        href: '/functional-locations',
    },
];

type FunctionalLocationProps = {
    functionalLocations: {
        data: FunctionalLocation[];
        meta: Meta;
    };
};

export default function FunctionalLocationIndex({ functionalLocations }: FunctionalLocationProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Functional Locations" />
            <TableFunctionalLocation functionalLocations={functionalLocations} />
        </AppLayout>
    );
}
