import TableUser from '@/components/tables/table-user';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Department, Meta, Position, User, WorkCenter } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

type UserProps = {
    users: {
        data: User[];
        meta: Meta;
    };
    departments: {
        data: Department[];
    };
    positions: {
        data: Position[];
    };
    workCenters: {
        data: WorkCenter[];
    };
    roles: string[];
};

export default function UserIndex({ users, departments, positions, workCenters, roles }: UserProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableUser users={users} departments={departments} positions={positions} workCenters={workCenters} roles={roles} />
        </AppLayout>
    );
}
