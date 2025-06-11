import TableDepartment from '@/components/table-department';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { Department, Meta, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Department',
        href: '/organizations/departments',
    },
];

interface DepartmentIndexProps {
    departments: {
        data: Department[];
        meta: Meta;
    };
}

export default function DepartmentIndex({ departments }: DepartmentIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Department" />

            <OrganizationsLayout>
                <div className="max-w-2xl space-y-4">
                    <TableDepartment departments={departments} />
                </div>
            </OrganizationsLayout>
        </AppLayout>
    );
}
