import TableRole from '@/components/table-role';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Meta, Role } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

type RoleIndexProps = {
    roles: {
        data: Role[];
        meta: Meta;
    };
};
export default function RoleIndex({ roles }: RoleIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />
            <TableRole roles={roles} />
        </AppLayout>
    );
}
