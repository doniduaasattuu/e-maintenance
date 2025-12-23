import TableRole from '@/components/tables/table-role';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Meta, Role } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: route('roles.index'),
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
            <TableRole roles={roles} />
        </AppLayout>
    );
}
