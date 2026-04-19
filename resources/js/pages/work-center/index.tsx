import TableWorkCenter from '@/components/tables/table-work-center';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { Meta, WorkCenter, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Work Centers',
        href: route('work-centers.index'),
    },
];

interface WorkCenterIndexProps {
    workCenters: {
        data: WorkCenter[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
}

export default function WorkCenterIndex({ workCenters, filters }: WorkCenterIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Work Centers" />

            <OrganizationsLayout>
                <TableWorkCenter workCenters={workCenters} filters={filters} />
            </OrganizationsLayout>
        </AppLayout>
    );
}
