import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { tableCaption } from '@/lib/utils';
import { FindingStatus, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface TableFindingStatusProps {
    findingStatuses: {
        data: FindingStatus[];
        meta: Meta;
    };
}

export default function TableFindingStatus({ findingStatuses }: TableFindingStatusProps) {
    const can = usePermissions();
    const meta = findingStatuses.meta;
    const caption = tableCaption(meta);

    function handleDeleteFindingStatus(id: number | string) {
        router.delete(route('finding-statuses.destroy', id));
    }
    return (
        <TableLayout title="Finding Status" description="Overview and management of finding status" className="md:max-w-7xl">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_findingstatus && <ButtonAdd tabIndex={2} route={route('finding-statuses.create')} />}
            </div>
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                <Table>
                    <TableCaption className="text-sm">{caption}</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-muted-foreground">Name</TableHead>
                            <TableHead className="text-muted-foreground">Description</TableHead>
                            <TableHead className="text-muted-foreground">Created at</TableHead>
                            <TableHead className={`text-muted-foreground ${can.delete_findingstatus ?? 'text-right'}`}>Updated at</TableHead>
                            {can.delete_findingstatus && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {findingStatuses.data.map((findingStatus: FindingStatus) => {
                            return (
                                <TableRow key={findingStatus.id}>
                                    <TableCell>
                                        {can.edit_findingstatus ? (
                                            <TextLink href={route('finding-statuses.edit', findingStatus.id)}>
                                                <span className="font-medium">{findingStatus.name}</span>
                                            </TextLink>
                                        ) : (
                                            <span className="font-medium">{findingStatus.name}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-75 truncate">{findingStatus.description}</TableCell>
                                    <TableCell className="table-timestamp text-muted-foreground">{findingStatus.created_at}</TableCell>
                                    <TableCell className={`table-timestamp text-muted-foreground ${can.delete_findingstatus ?? 'text-right'}`}>
                                        {findingStatus.updated_at}
                                    </TableCell>
                                    {can.delete_findingstatus && (
                                        <TableCell className="w-10 flex-col text-right align-top">
                                            <ActionConfirm
                                                action={() => handleDeleteFindingStatus(findingStatus.id)}
                                                title={`Delete finding status: ${findingStatus.name}?`}
                                                description="This action will remove this finding status and related finding from database. This action cannot be undone."
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
