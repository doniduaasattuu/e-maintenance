import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { FindingType, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import EmptyIcon from '../empty-icon';
import { PerPageSelector } from '../per-page-selector';

interface TableFindingTypeProps {
    findingTypes: {
        data: FindingType[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableFindingType({ findingTypes, withHeader = true, filters }: TableFindingTypeProps) {
    const { can } = usePermissions();
    const meta = findingTypes.meta;
    const caption = tableCaption(meta);

    function handleDeleteFindingType(id: number | string) {
        router.delete(route('finding-types.destroy', id));
    }
    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters.query} tabIndex={1} />
                        <PerPageSelector value={filters.per_page?.toString() ?? '10'} />
                    </div>
                    {can.create_findingtype && <ButtonAdd tabIndex={2} route={route('finding-types.create')} />}
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {findingTypes.data && findingTypes.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Description</TableHead>
                                <TableHead className="text-muted-foreground">Created at</TableHead>
                                <TableHead className={`text-muted-foreground ${can.delete_findingtype ?? 'text-right'}`}>Updated at</TableHead>
                                {can.delete_findingtype && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {findingTypes.data.map((findingType: FindingType) => {
                                return (
                                    <TableRow key={findingType.id}>
                                        <TableCell>
                                            {can.edit_findingtype ? (
                                                <TextLink href={route('finding-types.edit', findingType.id)}>
                                                    <span className="font-medium">{findingType.name}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{findingType.name}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-75 truncate">{findingType.code}</TableCell>
                                        <TableCell className="max-w-75 truncate">{findingType.description}</TableCell>
                                        <TableCell className="table-timestamp text-muted-foreground">{findingType.created_at}</TableCell>
                                        <TableCell className={`table-timestamp text-muted-foreground ${can.delete_findingtype ?? 'text-right'}`}>
                                            {findingType.updated_at}
                                        </TableCell>
                                        {can.delete_findingtype && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteFindingType(findingType.id)}
                                                    title={`Delete finding type: ${findingType.name}?`}
                                                    description="This action will remove this finding type and related finding from database. This action cannot be undone."
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
