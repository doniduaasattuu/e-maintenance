import TableRole from '@/components/tables/table-role';
import AppLayout from '@/layouts/app-layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Meta, Role } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.ROLE?.plural ?? 'Roles',
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
