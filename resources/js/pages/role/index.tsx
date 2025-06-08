import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Meta, Role } from '@/types';
import { router } from '@inertiajs/react';

import ButtonAdd from '@/components/button-add';
import { DeleteConfirm } from '@/components/delete-confirm';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

type RoleProps = {
    roles: {
        data: Role[];
        meta: Meta;
    };
};
export default function RoleIndex({ roles }: RoleProps) {
    const can = usePermissions();
    const meta = roles.meta;
    const tableCaption = `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total ?? 0} results`;

    function handleDelete(id: number) {
        router.delete(route('roles.destroy', id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TableLayout title="Roles" description="Role permission management" className="md:max-w-2xl">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                    {can.create_role && <ButtonAdd tabIndex={2} route={route('roles.create')} label="New Role" />}
                </div>
                <Table>
                    <TableCaption className="text-sm">{tableCaption}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-muted-foreground">#</TableHead>
                            <TableHead className="text-muted-foreground">Name</TableHead>
                            <TableHead className="text-muted-foreground">Created at</TableHead>
                            <TableHead className="text-muted-foreground">Updated at</TableHead>
                            {can.delete_role && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.data.map((role: Role, index: number) => {
                            return (
                                <TableRow key={role.id}>
                                    <TableCell className="w-[50px]">{meta.from + index}</TableCell>
                                    <TableCell className="font-medium">
                                        {can.update_role && role.name !== 'Admin' ? (
                                            <TextLink href={route('roles.edit', role.id)}>{role.name}</TextLink>
                                        ) : (
                                            <span>{role.name}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground w-[90px]">{role.created_at}</TableCell>
                                    <TableCell className="text-muted-foreground w-[90px]">{role.updated_at}</TableCell>

                                    {can.delete_role && (
                                        <TableCell className="w-10 text-right">
                                            {can.delete_role && role.name !== 'Admin' && (
                                                <DeleteConfirm
                                                    action={() => handleDelete(role.id)}
                                                    title={`Delete Role ${role.name}?`}
                                                    description="This action will remove this role from all users. This cannot be undone."
                                                >
                                                    <Trash2 size={18} className="text-red-500" />
                                                </DeleteConfirm>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <GeneratePagination meta={meta} />
            </TableLayout>
        </AppLayout>
    );
}
