import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { EquipmentStatus, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface TableEquipmentStatusProps {
    equipmentStatuses: {
        data: EquipmentStatus[];
        meta: Meta;
    };
}

export default function TableEquipmentStatus({ equipmentStatuses }: TableEquipmentStatusProps) {
    const can = usePermissions();
    const meta = equipmentStatuses.meta;
    const tableCaption = `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total ?? 0} results`;

    function handleDeleteEquipmentStatus(id: number | string) {
        router.delete(route('equipment-statuses.destroy', id));
    }
    return (
        <TableLayout title="Equipment Statuses" description="Overview and management of equipment statuses">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_equipmentstatus && <ButtonAdd tabIndex={2} route={route('equipment-statuses.create')} />}
            </div>
            <Table>
                <TableCaption className="text-sm">{tableCaption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-muted-foreground">Code</TableHead>
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Description</TableHead>
                        <TableHead className="text-muted-foreground">Created at</TableHead>
                        <TableHead className={`text-muted-foreground ${can.delete_equipmentstatus ?? 'text-right'}`}>Updated at</TableHead>
                        {can.delete_equipmentstatus && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {equipmentStatuses.data.map((equipmentStatus: EquipmentStatus) => {
                        return (
                            <TableRow key={equipmentStatus.id}>
                                <TableCell>
                                    {can.update_equipmentstatus ? (
                                        <TextLink href={route('equipment-statuses.edit', equipmentStatus.id)}>
                                            <span className="font-medium">{equipmentStatus.code}</span>
                                        </TextLink>
                                    ) : (
                                        <span className="font-medium">{equipmentStatus.code}</span>
                                    )}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">{equipmentStatus.name}</TableCell>
                                <TableCell className="max-w-[300px] truncate">{equipmentStatus.description}</TableCell>
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
            <GeneratePagination meta={meta} />
        </TableLayout>
    );
}
