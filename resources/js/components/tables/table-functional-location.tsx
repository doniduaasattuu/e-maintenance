import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { FunctionalLocation, Meta } from '@/types';
import { Link, router } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ButtonExport from '../button-export';
import DialogFunctionalLocationExportExcel from '../dialog-functional-location-export-excel';
import EmptyIcon from '../empty-icon';
import { PerPageSelector } from '../per-page-selector';
import { ButtonGroup } from '../ui/button-group';

interface TableFunctionalLocationProps {
    functionalLocations: {
        data: FunctionalLocation[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableFunctionalLocation({ functionalLocations, withHeader = true, filters }: TableFunctionalLocationProps) {
    const { can } = usePermissions();
    const meta = functionalLocations.meta;
    const caption = tableCaption(meta);
    const [exportDialog, setExportDialog] = useState<boolean>(false);

    function handleDeleteFunctionalLocation(id: number | string) {
        router.delete(route('functional-locations.destroy', id));
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
                        {can.create_functionallocation && <ButtonAdd tabIndex={3} route={route('functional-locations.create')} />}
                        {functionalLocations.data.length > 0 && (
                            <ButtonExport tabIndex={4} onClick={() => setExportDialog(true)} label="Export" variant={'outline'} />
                        )}
                    </ButtonGroup>
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {functionalLocations.data && functionalLocations.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Description</TableHead>
                                <TableHead className="text-muted-foreground">Created at</TableHead>
                                <TableHead className={`text-muted-foreground ${can.delete_functionallocation ?? 'text-right'}`}>Updated at</TableHead>
                                {can.edit_functionallocation && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                                {can.delete_functionallocation && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {functionalLocations.data.map((functionalLocation: FunctionalLocation) => {
                                return (
                                    <TableRow key={functionalLocation.id}>
                                        <TableCell>
                                            {can.show_functionallocation ? (
                                                <TextLink href={route('functional-locations.show', functionalLocation.id)}>
                                                    <span className="truncate font-medium">{functionalLocation.code}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="truncate font-medium">{functionalLocation.code}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-sm truncate sm:max-w-md">{functionalLocation.description}</TableCell>
                                        <TableCell className="table-timestamp text-muted-foreground">{functionalLocation.created_at}</TableCell>
                                        <TableCell
                                            className={`table-timestamp text-muted-foreground ${can.delete_functionallocation ?? 'text-right'}`}
                                        >
                                            {functionalLocation.updated_at}
                                        </TableCell>
                                        {can.edit_functionallocation && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <Link href={route('functional-locations.edit', functionalLocation.id)}>
                                                    <Edit size={18} className="text-blue-500" />
                                                </Link>
                                            </TableCell>
                                        )}
                                        {can.delete_functionallocation && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteFunctionalLocation(functionalLocation.id)}
                                                    title={`Delete data ${functionalLocation.code}?`}
                                                    description="This action will remove this functional location from database. This action cannot be undone."
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

            <DialogFunctionalLocationExportExcel open={exportDialog} setOpen={setExportDialog} />
        </>
    );
}
