import { Division, Meta, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import TableDivision from '@/components/table-divisions';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Division',
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
            <Head title="Division" />

            <OrganizationsLayout>
                <div className="max-w-4xl space-y-4">
                    <TableDivision divisions={divisions} />
                </div>
            </OrganizationsLayout>
        </AppLayout>
    );
}
