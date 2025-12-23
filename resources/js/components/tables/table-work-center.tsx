import { ActionConfirm } from '@/components/action-confirm';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { Meta, WorkCenter } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React from 'react';
import ButtonAdd from '../button-add';
import { GeneratePagination } from '../generate-pagination';
import SearchBar from '../search-bar';

interface WorkCenterTableProps {
    workCenters: {
        data: WorkCenter[];
        meta: Meta;
    };
}

export default function TableWorkCenter({ workCenters }: WorkCenterTableProps) {
    const can = usePermissions();
    const meta = workCenters.meta;
    const caption = tableCaption(meta);

    function handleDeleteWorkCenter(id: number) {
        router.delete(route('work-centers.destroy', id));
    }

    return (
        <React.Fragment>
            <div className="flex justify-between gap-2">
                <SearchBar />
                {can.create_workcenter && <ButtonAdd route={route('work-centers.create')} tabIndex={2} />}
            </div>
            <Table>
                <TableCaption className="text-sm">{caption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-muted-foreground">#</TableHead>
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Code</TableHead>
                        <TableHead className="text-muted-foreground">Created at</TableHead>
                        <TableHead className="text-muted-foreground">Updated at</TableHead>
                        {can.delete_workcenter && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {workCenters.data.map((workcenter: WorkCenter, index: number) => {
                        return (
                            <TableRow key={workcenter.id}>
                                <TableCell className="w-12.5">{meta.from + index}</TableCell>
                                <TableCell className="font-medium">
                                    {can.update_workcenter ? (
                                        <TextLink href={route('work-centers.edit', workcenter.id)}>{workcenter.name}</TextLink>
                                    ) : (
                                        <span>{workcenter.name}</span>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{workcenter.code}</TableCell>
                                <TableCell className="text-muted-foreground w-22.5">{workcenter.created_at}</TableCell>
                                <TableCell className="text-muted-foreground w-22.5">{workcenter.updated_at}</TableCell>

                                {can.delete_workcenter && (
                                    <TableCell className="w-10 text-right">
                                        <ActionConfirm
                                            action={() => handleDeleteWorkCenter(workcenter.id)}
                                            title={`Delete Work Center ${workcenter.code}?`}
                                            description="This action will remove this work center from database. This cannot be undone."
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
