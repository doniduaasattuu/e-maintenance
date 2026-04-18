import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import Filter from '@/components/filter';
import FilterDepartment from '@/components/filter-department';
import FilterPosition from '@/components/filter-position';
import FilterRole from '@/components/filter-role';
import FilterWithTrashed from '@/components/filter-with-trashed';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { CommandSeparator } from '@/components/ui/command';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import UserAvatar from '@/components/user-avatar';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { Department, Meta, Position, User, WorkCenter } from '@/types';
import { router } from '@inertiajs/react';
import { RefreshCcw, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import ButtonExport from '../button-export';
import DialogUserExportExcel from '../dialog-user-export-excel';
import EmptyIcon from '../empty-icon';
import FilterWorkCenter from '../filter-work-center';
import { ButtonGroup } from '../ui/button-group';

interface TableUserProps {
    users: {
        data: User[];
        meta: Meta;
    };
    departments?: {
        data: Department[];
    };
    positions?: {
        data: Position[];
    };
    workCenters?: {
        data: WorkCenter[];
    };
    roles: string[];
    withHeader?: boolean;
}

export default function TableUser({ users, departments, positions, workCenters, roles, withHeader = true }: TableUserProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    const { can } = usePermissions();
    const meta = users.meta;
    const caption = tableCaption(meta);

    function handleDeleteUser(id: number) {
        router.delete(route('users.destroy', id));
    }

    function handleRestoreUser(id: number) {
        router.post(route('users.restore', id));
    }

    const [exportDialog, setExportDialog] = useState<boolean>(false);

    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar tabIndex={1} />
                        <Filter open={open} setOpen={setOpen} keys={['department', 'position', 'work-center', 'role']}>
                            <FilterDepartment departments={departments?.data ?? []} />
                            <CommandSeparator />
                            <FilterPosition positions={positions?.data ?? []} />
                            <CommandSeparator />
                            <FilterWorkCenter workCenters={workCenters?.data ?? []} />
                            <CommandSeparator />
                            <FilterRole roles={roles} />
                            <CommandSeparator />
                            <FilterWithTrashed />
                        </Filter>
                    </div>
                    <ButtonGroup>
                        {can.create_user && <ButtonAdd tabIndex={2} route={route('users.create')} />}
                        {users.data.length > 0 && (
                            <ButtonExport tabIndex={3} onClick={() => setExportDialog(true)} label="Export" variant={'outline'} />
                        )}
                    </ButtonGroup>
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {users.data && users.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">#</TableHead>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Contact</TableHead>
                                <TableHead className="text-muted-foreground">Department</TableHead>
                                <TableHead className="text-muted-foreground">Work Center</TableHead>
                                <TableHead className={`text-muted-foreground ${can.delete_user ?? 'text-right'}`}>Created at</TableHead>
                                {can.delete_user && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user: User) => {
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell className="w-12.5 truncate">
                                            <UserAvatar user={user} />
                                        </TableCell>

                                        <TableCell className="flex-col align-top">
                                            <div className="flex max-w-sm flex-col items-start truncate">
                                                {can.update_user && user.deleted_at == null ? (
                                                    <TextLink href={route('users.edit', user.id)}>
                                                        <span className="font-medium">{user.name}</span>
                                                    </TextLink>
                                                ) : (
                                                    <span className="font-medium">{user.name}</span>
                                                )}
                                                <span className="text-muted-foreground">{user.employee_id}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex-col align-top">
                                            <div className="flex max-w-sm flex-col items-start truncate">
                                                <span className="font-medium">{user.email}</span>
                                                <span className="text-muted-foreground">{user.phone_number}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex-col align-top">
                                            <div className="flex max-w-sm flex-col items-start truncate">
                                                <span className="font-medium">{user.department?.name}</span>
                                                <span className="text-muted-foreground">{user.position?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex-col align-top">
                                            <div className="flex max-w-sm flex-col items-start truncate">
                                                <span className="font-medium">{user.work_center?.code}</span>
                                                <span className="text-muted-foreground">{user.work_center?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex-col align-top">
                                            <div className={`flex max-w-sm flex-col ${can.delete_user ? 'items-start' : 'items-end'} truncate`}>
                                                <span className="text-muted-foreground">{user.created_at}</span>
                                                <span className="text-muted-foreground">{user.updated_at}</span>
                                            </div>
                                        </TableCell>
                                        {can.delete_user && user.deleted_at === null ? (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteUser(user.id)}
                                                    title={`Delete User ${user.name}?`}
                                                    description="This action will remove this user from database."
                                                >
                                                    <Trash2 size={18} className="text-red-500" />
                                                </ActionConfirm>
                                            </TableCell>
                                        ) : (
                                            can.restore_user &&
                                            user.deleted_at !== null && (
                                                <TableCell className="w-10 flex-col text-right align-top">
                                                    <ActionConfirm
                                                        action={() => handleRestoreUser(user.id)}
                                                        title={`Restore User ${user.name}?`}
                                                        description="This action will restore user from database."
                                                        actionLabel="Restore"
                                                    >
                                                        <RefreshCcw size={18} className="text-blue-500" />
                                                    </ActionConfirm>
                                                </TableCell>
                                            )
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

            <DialogUserExportExcel
                open={exportDialog}
                setOpen={setExportDialog}
                departments={departments}
                positions={positions}
                workCenters={workCenters}
            />
        </>
    );
}
