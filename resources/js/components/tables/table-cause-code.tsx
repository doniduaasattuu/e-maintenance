import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { CauseCode, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import EmptyIcon from '../empty-icon';
import { PerPageSelector } from '../per-page-selector';

interface TableCauseCodeProps {
    causeCodes: {
        data: CauseCode[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableCauseCode({ causeCodes, withHeader = true, filters }: TableCauseCodeProps) {
    const { can } = usePermissions();
    const meta = causeCodes.meta;
    const caption = tableCaption(meta);

    function handleDeleteCauseCode(id: number | string) {
        router.delete(route('cause-codes.destroy', id));
    }
    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters.query} tabIndex={1} />
                        <PerPageSelector value={filters.per_page?.toString() ?? '10'} />
                    </div>
                    {can.create_causecode && <ButtonAdd tabIndex={2} route={route('cause-codes.create')} />}
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {causeCodes.data && causeCodes.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Description</TableHead>
                                <TableHead className="text-muted-foreground">Created at</TableHead>
                                <TableHead className={`text-muted-foreground ${can.delete_causecode ?? 'text-right'}`}>Updated at</TableHead>
                                {can.delete_causecode && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {causeCodes.data.map((causeCode: CauseCode) => {
                                return (
                                    <TableRow key={causeCode.id}>
                                        <TableCell>
                                            {can.edit_causecode ? (
                                                <TextLink href={route('cause-codes.edit', causeCode.id)}>
                                                    <span className="font-medium">{causeCode.code}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{causeCode.code}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-75 truncate">{causeCode.description}</TableCell>
                                        <TableCell className="table-timestamp text-muted-foreground">{causeCode.created_at}</TableCell>
                                        <TableCell className={`table-timestamp text-muted-foreground ${can.delete_causecode ?? 'text-right'}`}>
                                            {causeCode.updated_at}
                                        </TableCell>
                                        {can.delete_causecode && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteCauseCode(causeCode.id)}
                                                    title={`Delete cause code: ${causeCode.code}?`}
                                                    description="This action will remove this cause code and related cause code from database. This action cannot be undone."
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
