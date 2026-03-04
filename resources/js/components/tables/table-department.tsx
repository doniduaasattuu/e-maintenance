import { ActionConfirm } from '@/components/action-confirm';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { Department, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React from 'react';
import ButtonAdd from '../button-add';
import EmptyIcon from '../empty-icon';
import { GeneratePagination } from '../generate-pagination';
import SearchBar from '../search-bar';

interface DepartmentTableProps {
    departments: {
        data: Department[];
        meta: Meta;
    };
}

export default function TableDepartment({ departments }: DepartmentTableProps) {
    const can = usePermissions();
    const meta = departments.meta;
    const caption = tableCaption(meta);

    function handleDeleteDepartment(id: number) {
        router.delete(route('departments.destroy', id));
    }

    return (
        <React.Fragment>
            <div className="flex justify-between gap-2">
                <SearchBar />
                {can.create_department && <ButtonAdd route={route('departments.create')} tabIndex={2} />}
            </div>
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {departments.data.length > 0 ? (
                    <Table>
                        <TableCaption className="text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">#</TableHead>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Division</TableHead>
                                <TableHead className="text-muted-foreground">Personnel</TableHead>
                                <TableHead className="text-muted-foreground">Created at</TableHead>
                                <TableHead className="text-muted-foreground">Updated at</TableHead>
                                {can.delete_department && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {departments.data.map((department: Department, index: number) => {
                                return (
                                    <TableRow key={department.id}>
                                        <TableCell className="w-12.5">{meta.from + index}</TableCell>
                                        <TableCell className="font-medium">
                                            {can.edit_department ? (
                                                <TextLink href={route('departments.edit', department.id)}>{department.name}</TextLink>
                                            ) : (
                                                <span>{department.name}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{department.code}</TableCell>
                                        <TableCell>{department.division?.name}</TableCell>
                                        <TableCell>{department.users}</TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{department.created_at}</TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{department.updated_at}</TableCell>

                                        {can.delete_department && (
                                            <TableCell className="w-10 text-right">
                                                <ActionConfirm
                                                    action={() => handleDeleteDepartment(department.id)}
                                                    title={`Delete Department ${department.name}?`}
                                                    description="This action will remove this department from all users. This cannot be undone."
                                                >
                                                    <Trash2 size={18} className="text-red-500" />
                                                </ActionConfirm>
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
        </React.Fragment>
    );
}
