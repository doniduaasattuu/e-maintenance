import TableWorkCenter from '@/components/tables/table-work-center';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { Meta, WorkCenter, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Work Centers',
        href: '/organizations/work-centers',
    },
];

interface WorkCenterIndexProps {
    workCenters: {
        data: WorkCenter[];
        meta: Meta;
    };
}

export default function WorkCenterIndex({ workCenters }: WorkCenterIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Work Centers" />

            <OrganizationsLayout>
                <TableWorkCenter workCenters={workCenters} />
            </OrganizationsLayout>
        </AppLayout>
    );
}
