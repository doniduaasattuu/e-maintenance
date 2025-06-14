import { ActionConfirm } from '@/components/action-confirm';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { Division, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React from 'react';
import ButtonAdd from './button-add';
import { GeneratePagination } from './generate-pagination';
import SearchBar from './search-bar';

interface DivisionTableProps {
    divisions: {
        data: Division[];
        meta: Meta;
    };
}

export default function TableDivision({ divisions }: DivisionTableProps) {
    const can = usePermissions();
    const meta = divisions.meta;
    const tableCaption = `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total ?? 0} results`;

    function handleDeleteDivision(id: number) {
        router.delete(route('divisions.destroy', id));
    }

    return (
        <React.Fragment>
            <div className="flex justify-between gap-2">
                <SearchBar />
                {can.create_division && <ButtonAdd route={route('divisions.create')} label="New Division" tabIndex={2} />}
            </div>
            <Table>
                <TableCaption className="text-sm">{tableCaption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-muted-foreground">#</TableHead>
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Code</TableHead>
                        <TableHead className="text-muted-foreground">Created at</TableHead>
                        <TableHead className="text-muted-foreground">Updated at</TableHead>
                        {can.delete_division && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {divisions.data.map((division: Division, index: number) => {
                        return (
                            <TableRow key={division.id}>
                                <TableCell className="w-[50px]">{meta.from + index}</TableCell>
                                <TableCell className="font-medium">
                                    {can.update_division ? (
                                        <TextLink href={route('divisions.edit', division.id)}>{division.name}</TextLink>
                                    ) : (
                                        <span>{division.name}</span>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{division.code}</TableCell>
                                <TableCell className="text-muted-foreground w-[90px]">{division.created_at}</TableCell>
                                <TableCell className="text-muted-foreground w-[90px]">{division.updated_at}</TableCell>

                                {can.delete_division && (
                                    <TableCell className="w-10 text-right">
                                        <ActionConfirm
                                            action={() => handleDeleteDivision(division.id)}
                                            title={`Delete Division ${division.name}?`}
                                            description="This action will remove this division from all users. This cannot be undone."
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
