import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { tableCaption } from '@/lib/utils';
import { FindingClause, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import EmptyIcon from '../empty-icon';

interface TableFindingClauseProps {
    findingClauses: {
        data: FindingClause[];
        meta: Meta;
    };
}

export default function TableFindingClause({ findingClauses }: TableFindingClauseProps) {
    const { can } = usePermissions();
    const meta = findingClauses.meta;
    const caption = tableCaption(meta);

    function handleDeleteFindingClause(id: number | string) {
        router.delete(route('finding-clauses.destroy', id));
    }
    return (
        <TableLayout title="Finding Clauses" description="Overview and management of finding clause" className="md:max-w-7xl">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_findingclause && <ButtonAdd tabIndex={2} route={route('finding-clauses.create')} />}
            </div>
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {findingClauses.data.length > 0 ? (
                    <Table>
                        <TableCaption className="text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Title</TableHead>
                                <TableHead className="text-muted-foreground">Description</TableHead>
                                <TableHead className="text-muted-foreground">Created at</TableHead>
                                <TableHead className={`text-muted-foreground ${can.delete_findingclause ?? 'text-right'}`}>Updated at</TableHead>
                                {can.delete_findingclause && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {findingClauses.data.map((findingClause: FindingClause) => {
                                return (
                                    <TableRow key={findingClause.id}>
                                        <TableCell>
                                            {can.edit_findingclause ? (
                                                <TextLink href={route('finding-clauses.edit', findingClause.id)}>
                                                    <span className="font-medium">{findingClause.code}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{findingClause.code}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-75 truncate">{findingClause.title}</TableCell>
                                        <TableCell className="max-w-75 truncate">{findingClause.description}</TableCell>
                                        <TableCell className="table-timestamp text-muted-foreground">{findingClause.created_at}</TableCell>
                                        <TableCell className={`table-timestamp text-muted-foreground ${can.delete_findingclause ?? 'text-right'}`}>
                                            {findingClause.updated_at}
                                        </TableCell>
                                        {can.delete_findingclause && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteFindingClause(findingClause.id)}
                                                    title={`Delete finding clause: ${findingClause.title}?`}
                                                    description="This action will remove this finding clause and related finding from database. This action cannot be undone."
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
        </TableLayout>
    );
}
