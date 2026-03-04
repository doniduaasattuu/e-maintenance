import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { tableCaption } from '@/lib/utils';
import { Meta, Role } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import EmptyIcon from '../empty-icon';

interface TableRoleProps {
    roles: {
        data: Role[];
        meta: Meta;
    };
}

export default function TableRole({ roles }: TableRoleProps) {
    const can = usePermissions();
    const meta = roles.meta;
    const caption = tableCaption(meta);

    function handleDeleteRole(id: number) {
        router.delete(route('roles.destroy', id));
    }

    return (
        <TableLayout title="Roles" description="Role permission management" className="md:max-w-2xl">
            <div className="flex justify-between gap-2">
                <SearchBar tabIndex={1} />
                {can.create_role && <ButtonAdd tabIndex={2} route={route('roles.create')} />}
            </div>
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {roles.data.length > 0 ? (
                    <Table>
                        <TableCaption className="text-sm">{caption}</TableCaption>
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
                                        <TableCell className="w-12.5">{meta.from + index}</TableCell>
                                        <TableCell className="font-medium">
                                            {can.update_role ? (
                                                <TextLink href={route('roles.edit', role.id)}>{role.name}</TextLink>
                                            ) : (
                                                <span>{role.name}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{role.created_at}</TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{role.updated_at}</TableCell>

                                        {can.delete_role && (
                                            <TableCell className="w-10 text-right">
                                                {can.delete_role && role.name !== 'Admin' && (
                                                    <ActionConfirm
                                                        action={() => handleDeleteRole(role.id)}
                                                        title={`Delete Role ${role.name}?`}
                                                        description="This action will remove this role from all users. This cannot be undone."
                                                    >
                                                        <Trash2 size={18} className="text-red-500" />
                                                    </ActionConfirm>
                                                )}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <EmptyIcon />
                )}
            </div>
            <GeneratePagination meta={meta} />
        </TableLayout>
    );
}
