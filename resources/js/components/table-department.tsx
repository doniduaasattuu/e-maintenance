import { ActionConfirm } from '@/components/action-confirm';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { Department, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React from 'react';
import ButtonAdd from './button-add';
import { GeneratePagination } from './generate-pagination';
import SearchBar from './search-bar';

interface DepartmentTableProps {
    departments: {
        data: Department[];
        meta: Meta;
    };
}

export default function TableDepartment({ departments }: DepartmentTableProps) {
    const can = usePermissions();
    const meta = departments.meta;
    const tableCaption = `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total ?? 0} results`;

    function handleDeleteDepartment(id: number) {
        router.delete(route('divisions.destroy', id));
    }

    return (
        <React.Fragment>
            <div className="flex justify-between gap-2">
                <SearchBar />
                <ButtonAdd route={route('departments.create')} label="New Department" tabIndex={2} />
            </div>
            <Table>
                <TableCaption className="text-sm">{tableCaption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-muted-foreground">#</TableHead>
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Code</TableHead>
                        <TableHead className="text-muted-foreground">Division</TableHead>
                        <TableHead className="text-muted-foreground">Created at</TableHead>
                        <TableHead className="text-muted-foreground">Updated at</TableHead>
                        {can.delete_department && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {departments.data.map((department: Department, index: number) => {
                        return (
                            <TableRow key={department.id}>
                                <TableCell className="w-[50px]">{meta.from + index}</TableCell>
                                <TableCell className="font-medium">
                                    {can.update_department ? (
                                        <TextLink href={route('departments.edit', department.id)}>{department.name}</TextLink>
                                    ) : (
                                        <span>{department.name}</span>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{department.code}</TableCell>
                                <TableCell>{department.division?.name}</TableCell>
                                <TableCell className="text-muted-foreground w-[90px]">{department.created_at}</TableCell>
                                <TableCell className="text-muted-foreground w-[90px]">{department.updated_at}</TableCell>

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
            <GeneratePagination meta={meta} />
        </React.Fragment>
    );
}
