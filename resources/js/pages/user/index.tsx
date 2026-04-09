import TableUser from '@/components/tables/table-user';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Department, Meta, Position, User, WorkCenter } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.USER?.plural ?? 'Users',
        href: route('users.index'),
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
            <TableLayout moduleKey={'USER'} className="md:max-w-7xl">
                <TableUser users={users} departments={departments} positions={positions} workCenters={workCenters} roles={roles} />
            </TableLayout>
        </AppLayout>
    );
}
