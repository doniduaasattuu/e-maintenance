import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { tableCaption } from '@/lib/utils';
import { FunctionalLocation, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface TableFunctionalLocationProps {
    functionalLocations: {
        data: FunctionalLocation[];
        meta: Meta;
    };
}

export default function TableFunctionalLocation({ functionalLocations }: TableFunctionalLocationProps) {
    const can = usePermissions();
    const meta = functionalLocations.meta;
    const caption = tableCaption(meta);

    function handleDeleteFunctionalLocation(id: number | string) {
        router.delete(route('functional-locations.destroy', id));
    }
    return (
        <TableLayout
            title="Functional Locations"
            description="Overview and management of functional locations in the system"
            className="md:max-w-7xl"
        >
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_functionallocation && <ButtonAdd tabIndex={2} route={route('functional-locations.create')} />}
            </div>
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                <Table>
                    <TableCaption className="text-sm">{caption}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-muted-foreground">Code</TableHead>
                            <TableHead className="text-muted-foreground">Description</TableHead>
                            <TableHead className="text-muted-foreground">Created at</TableHead>
                            <TableHead className={`text-muted-foreground ${can.delete_functionallocation ?? 'text-right'}`}>Updated at</TableHead>
                            {can.delete_functionallocation && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {functionalLocations.data.map((functionalLocation: FunctionalLocation) => {
                            return (
                                <TableRow key={functionalLocation.id}>
                                    <TableCell>
                                        {can.update_functionallocation ? (
                                            <TextLink href={route('functional-locations.edit', functionalLocation.id)}>
                                                <span className="truncate font-medium">{functionalLocation.code}</span>
                                            </TextLink>
                                        ) : (
                                            <span className="truncate font-medium">{functionalLocation.code}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-sm truncate sm:max-w-md">{functionalLocation.description}</TableCell>
                                    <TableCell className="table-timestamp text-muted-foreground">{functionalLocation.created_at}</TableCell>
                                    <TableCell className={`table-timestamp text-muted-foreground ${can.delete_functionallocation ?? 'text-right'}`}>
                                        {functionalLocation.updated_at}
                                    </TableCell>
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
            </div>
            <GeneratePagination meta={meta} />
        </TableLayout>
    );
}
