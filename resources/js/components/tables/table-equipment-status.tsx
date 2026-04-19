import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { EquipmentStatus, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import EmptyIcon from '../empty-icon';
import { PerPageSelector } from '../per-page-selector';

interface TableEquipmentStatusProps {
    equipmentStatuses: {
        data: EquipmentStatus[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableEquipmentStatus({ equipmentStatuses, withHeader = true, filters }: TableEquipmentStatusProps) {
    const { can } = usePermissions();
    const meta = equipmentStatuses.meta;
    const caption = tableCaption(meta);

    function handleDeleteEquipmentStatus(id: number | string) {
        router.delete(route('equipment-statuses.destroy', id));
    }
    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters.query} tabIndex={1} />
                        <PerPageSelector value={filters.per_page?.toString() ?? '10'} />
                    </div>
                    {can.create_equipmentstatus && <ButtonAdd tabIndex={2} route={route('equipment-statuses.create')} />}
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {equipmentStatuses.data && equipmentStatuses.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Description</TableHead>
                                <TableHead className="table-timestamp text-muted-foreground">Created at</TableHead>
                                <TableHead className={`table-timestamp text-muted-foreground ${can.delete_equipmentstatus ?? 'text-right'}`}>
                                    Updated at
                                </TableHead>
                                {can.delete_equipmentstatus && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {equipmentStatuses.data.map((equipmentStatus: EquipmentStatus) => {
                                return (
                                    <TableRow key={equipmentStatus.id}>
                                        <TableCell>
                                            {can.edit_equipmentstatus ? (
                                                <TextLink href={route('equipment-statuses.edit', equipmentStatus.id)}>
                                                    <span className="font-medium">{equipmentStatus.code}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{equipmentStatus.code}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-50 truncate">{equipmentStatus.name}</TableCell>
                                        <TableCell className="max-w-75 truncate">{equipmentStatus.description}</TableCell>
                                        <TableCell className="text-muted-foreground">{equipmentStatus.created_at}</TableCell>
                                        <TableCell className={`text-muted-foreground ${can.delete_equipmentstatus ?? 'text-right'}`}>
                                            {equipmentStatus.updated_at}
                                        </TableCell>
                                        {can.delete_equipmentstatus && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteEquipmentStatus(equipmentStatus.id)}
                                                    title={`Delete data ${equipmentStatus.code}?`}
                                                    description="This action will remove this equipment status and related equipment from database. This action cannot be undone."
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
