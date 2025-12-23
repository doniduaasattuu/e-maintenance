import TableDepartment from '@/components/tables/table-department';
import AppLayout from '@/layouts/app-layout';
import OrganizationsLayout from '@/layouts/organizations/layout';
import { Department, Meta, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Departments',
        href: route('departments.index'),
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
            <Head title="Departments" />

            <OrganizationsLayout>
                <TableDepartment departments={departments} />
            </OrganizationsLayout>
        </AppLayout>
    );
}
