import { ActionConfirm } from '@/components/action-confirm';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { Division, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import ButtonAdd from '../button-add';
import EmptyIcon from '../empty-icon';
import { GeneratePagination } from '../generate-pagination';
import { PerPageSelector } from '../per-page-selector';
import SearchBar from '../search-bar';

interface DivisionTableProps {
    divisions: {
        data: Division[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableDivision({ divisions, withHeader = true, filters }: DivisionTableProps) {
    const { can } = usePermissions();
    const meta = divisions.meta;
    const caption = tableCaption(meta);

    function handleDeleteDivision(id: number) {
        router.delete(route('divisions.destroy', id));
    }

    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters.query} tabIndex={1} />
                        <PerPageSelector value={filters.per_page?.toString() ?? '10'} />
                    </div>
                    {can.create_division && <ButtonAdd route={route('divisions.create')} tabIndex={2} />}
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {divisions.data && divisions.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
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
                                        <TableCell className="w-12.5">{meta.from + index}</TableCell>
                                        <TableCell className="font-medium">
                                            {can.update_division ? (
                                                <TextLink href={route('divisions.edit', division.id)}>{division.name}</TextLink>
                                            ) : (
                                                <span>{division.name}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{division.code}</TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{division.created_at}</TableCell>
                                        <TableCell className="text-muted-foreground w-22.5">{division.updated_at}</TableCell>

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
                ) : (
                    <EmptyIcon />
                )}
            </div>
            <GeneratePagination meta={meta} />
        </>
    );
}
