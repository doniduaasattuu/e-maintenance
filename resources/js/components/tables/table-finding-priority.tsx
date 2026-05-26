import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { FindingPriority, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import ButtonExport from '../button-export';
import EmptyIcon from '../empty-icon';
import { PerPageSelector } from '../per-page-selector';
import { ButtonGroup } from '../ui/button-group';

interface TableFindingPriorityProps {
    findingPriorities: {
        data: FindingPriority[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableFindingPriority({ findingPriorities, withHeader = true, filters }: TableFindingPriorityProps) {
    const { can } = usePermissions();
    const meta = findingPriorities.meta;
    const caption = tableCaption(meta);

    function handleDeleteFindingPriority(id: number | string) {
        router.delete(route('finding-priorities.destroy', id));
    }
    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters?.query} tabIndex={1} />
                        <PerPageSelector value={filters?.per_page?.toString() ?? '10'} tabIndex={2} />
                    </div>
                    <ButtonGroup>
                        {can.create_findingpriority && <ButtonAdd tabIndex={3} route={route('finding-priorities.create')} />}
                        <ButtonExport tabIndex={4} onClick={() => (window.location.href = route('finding-priorities.export'))} />
                    </ButtonGroup>
                </div>
            )}

            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {findingPriorities?.data && findingPriorities?.data?.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Label</TableHead>
                                <TableHead className="text-muted-foreground">Description</TableHead>
                                <TableHead className="text-muted-foreground">SLA</TableHead>
                                <TableHead className="text-muted-foreground">Created at</TableHead>
                                <TableHead className={`text-muted-foreground ${can.delete_findingpriority ?? 'text-right'}`}>Updated at</TableHead>
                                {can.delete_findingpriority && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {findingPriorities.data.map((findingPriority: FindingPriority) => {
                                return (
                                    <TableRow key={findingPriority.id}>
                                        <TableCell>
                                            {can.edit_findingpriority ? (
                                                <TextLink href={route('finding-priorities.edit', findingPriority.id)}>
                                                    <span className="font-medium">{findingPriority.label}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{findingPriority.label}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-75 truncate">{findingPriority.description}</TableCell>
                                        <TableCell className="max-w-75 truncate">{findingPriority.sla_resolution_hours}</TableCell>
                                        <TableCell className="table-timestamp text-muted-foreground">{findingPriority.created_at}</TableCell>
                                        <TableCell className={`table-timestamp text-muted-foreground ${can.delete_findingpriority ?? 'text-right'}`}>
                                            {findingPriority.updated_at}
                                        </TableCell>
                                        {can.delete_findingpriority && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteFindingPriority(findingPriority.id)}
                                                    title={`Delete finding priority: ${findingPriority.label}?`}
                                                    description="This action will remove this finding priority and related finding from database. This action cannot be undone."
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
