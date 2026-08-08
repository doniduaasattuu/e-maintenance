import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { ImprovementCategory, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import ButtonExport from '../button-export';
import EmptyIcon from '../empty-icon';
import { PerPageSelector } from '../per-page-selector';
import { ButtonGroup } from '../ui/button-group';

interface TableImprovementCategoryProps {
    improvementCategories: {
        data: ImprovementCategory[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableImprovementCategory({ improvementCategories, withHeader = true, filters }: TableImprovementCategoryProps) {
    const { can } = usePermissions();
    const meta = improvementCategories.meta;
    const caption = tableCaption(meta);

    function handleDeleteImprovementCategory(id: number | string) {
        router.delete(route('improvement-categories.destroy', id));
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
                        {can.create_improvementcategory && <ButtonAdd tabIndex={3} route={route('improvement-categories.create')} />}
                        <ButtonExport tabIndex={4} onClick={() => (window.location.href = route('improvement-categories.export'))} />
                    </ButtonGroup>
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {improvementCategories?.data && improvementCategories?.data?.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Description</TableHead>
                                <TableHead className="table-timestamp text-muted-foreground">Created at</TableHead>
                                <TableHead className={`table-timestamp text-muted-foreground ${can.delete_improvementcategory ?? 'text-right'}`}>
                                    Updated at
                                </TableHead>
                                {can.delete_improvementcategory && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {improvementCategories.data.map((improvementCategory: ImprovementCategory) => {
                                return (
                                    <TableRow key={improvementCategory.id}>
                                        <TableCell>
                                            {can.edit_improvementcategory ? (
                                                <TextLink href={route('improvement-categories.edit', improvementCategory.id)}>
                                                    <span className="font-medium">{improvementCategory.name}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{improvementCategory.name}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-75 truncate">{improvementCategory.description}</TableCell>
                                        <TableCell className="text-muted-foreground">{improvementCategory.created_at}</TableCell>
                                        <TableCell className={`text-muted-foreground ${can.delete_improvementcategory ?? 'text-right'}`}>
                                            {improvementCategory.updated_at}
                                        </TableCell>
                                        {can.delete_improvementcategory && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteImprovementCategory(improvementCategory.id)}
                                                    title={`Delete data ${improvementCategory.name}?`}
                                                    description="This action will remove this improvement category from database. This action cannot be undone."
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
