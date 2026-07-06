import TablePermission from '@/components/tables/table-permission';
import AppLayout from '@/layouts/app-layout';
import TableLayout from '@/layouts/table/layout';
import { UI_STRINGS } from '@/lib/ui-strings';
import { BreadcrumbItem, Meta, Permission } from '@/types';

const strings = UI_STRINGS;
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: strings.PERMISSION?.plural ?? 'Permissions',
        href: route('permissions.index'),
    },
];

type PermissionIndexProps = {
    permissions: {
        data: Permission[];
        meta: Meta;
    };
    filters: {
        query: string;
        per_page: string;
    };
};
export default function RoleIndex({ permissions, filters }: PermissionIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout moduleKey={'PERMISSION'} className="md:max-w-4xl">
                <TablePermission permissions={permissions} filters={filters} />
            </TableLayout>
        </AppLayout>
    );
}
