import { Division, Meta, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import TableDivision from '@/components/tables/table-divisions';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Divisions',
        href: '/organizations/divisions',
    },
];

interface DivisionIndexProps {
    divisions: {
        data: Division[];
        meta: Meta;
    };
}

export default function DivisionIndex({ divisions }: DivisionIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Divisions" />

            <OrganizationsLayout>
                <TableDivision divisions={divisions} />
            </OrganizationsLayout>
        </AppLayout>
    );
}
