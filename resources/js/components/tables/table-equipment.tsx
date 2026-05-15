import { ActionConfirm } from '@/components/action-confirm';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { Equipment, EquipmentClass, EquipmentStatus, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import ButtonAdd from '../button-add';
import ButtonExport from '../button-export';
import DialogEquipmentExportExcel from '../dialog-equipment-export-excel';
import EmptyIcon from '../empty-icon';
import Filter from '../filter';
import FilterEquipmentClass from '../filter-equipment-class';
import FilterEquipmentStatus from '../filter-equipment-status';
import { GeneratePagination } from '../generate-pagination';
import { PerPageSelector } from '../per-page-selector';
import SearchBar from '../search-bar';
import TextLink from '../text-link';
import { ButtonGroup } from '../ui/button-group';
import { CommandSeparator } from '../ui/command';

interface EquipmentTableProps {
    mode?: 'standalone' | 'functional-location';
    equipments: {
        data: Equipment[];
        meta: Meta;
    };
    equipmentClasses?: {
        data: EquipmentClass[];
    };
    equipmentStatuses?: {
        data: EquipmentStatus[];
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableEquipment({
    mode = 'standalone',
    equipments,
    equipmentClasses,
    equipmentStatuses,
    withHeader = true,
    filters,
}: EquipmentTableProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    const { can } = usePermissions();
    const meta = equipments.meta;
    const caption = tableCaption(meta);

    function handleDeleteEquipment(id: number) {
        router.delete(route('equipments.destroy', id));
    }

    const [exportDialog, setExportDialog] = useState<boolean>(false);

    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters?.query} tabIndex={1} />
                        <PerPageSelector value={filters?.per_page?.toString() ?? '10'} tabIndex={2} />
                        <Filter open={open} setOpen={setOpen} keys={['class', 'status']}>
                            <FilterEquipmentClass equipmentClasses={equipmentClasses?.data ?? []} />
                            <CommandSeparator />
                            <FilterEquipmentStatus equipmentStatuses={equipmentStatuses?.data ?? []} />
                        </Filter>
                    </div>
                    {mode == 'standalone' && (
                        <ButtonGroup>
                            {can.create_equipment && <ButtonAdd route={route('equipments.create')} tabIndex={3} />}
                            {equipments.data.length > 0 && (
                                <ButtonExport tabIndex={4} onClick={() => setExportDialog(true)} label="Export" variant={'outline'} />
                            )}
                        </ButtonGroup>
                    )}
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {equipments.data && equipments.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Details</TableHead>
                                <TableHead className="text-muted-foreground">Class</TableHead>
                                <TableHead className="text-muted-foreground">Functional Location</TableHead>
                                <TableHead className="text-muted-foreground">Date</TableHead>
                                {mode == 'standalone' && can.delete_equipment && (
                                    <TableHead className="text-muted-foreground w-10 text-right"></TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {equipments?.data?.map((equipment: Equipment) => {
                                return (
                                    <TableRow key={equipment.id}>
                                        <TableCell className="flex-col align-top">
                                            <div className="flex max-w-sm flex-col items-start">
                                                {can.show_equipment ? (
                                                    <TextLink className="font-medium" href={route('equipments.show', equipment.id)}>
                                                        {equipment.code}
                                                    </TextLink>
                                                ) : (
                                                    <span>{equipment.code}</span>
                                                )}
                                                <span className="text-muted-foreground">{equipment.status?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex-col align-top">
                                            <div className="flex max-w-sm flex-col items-start">
                                                <span className="max-w-xs font-medium">{equipment.sort_field}</span>
                                                <span className="text-muted-foreground max-w-md truncate">{equipment.description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex-col align-top">
                                            <div className="flex max-w-sm flex-col items-start">
                                                <span className="max-w-xs font-medium">{equipment.eclass?.name}</span>
                                                <span className="text-muted-foreground">{equipment.eclass?.code}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex-col align-top">
                                            <div className="flex max-w-sm flex-col items-start">
                                                {can.update_functionallocation && equipment.functionalLocation ? (
                                                    <span className="max-w-xs font-medium">{equipment.functionalLocation.code}</span>
                                                ) : (
                                                    <span className="max-w-xs font-medium">{equipment.functionalLocation?.code}</span>
                                                )}
                                                <span className="text-muted-foreground max-w-sm truncate">
                                                    {equipment.functionalLocation?.description}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex-col align-top">
                                            <div className="flex max-w-sm flex-col items-start">
                                                <span className="table-timestamp text-muted-foreground text-xs">{equipment.created_at}</span>
                                                <span className="table-timestamp text-muted-foreground text-xs">{equipment.updated_at}</span>
                                            </div>
                                        </TableCell>

                                        {mode == 'standalone' && can.delete_equipment && (
                                            <TableCell className="table-icon">
                                                <ActionConfirm
                                                    action={() => handleDeleteEquipment(equipment.id)}
                                                    title={`Delete Equipment ${equipment.code}?`}
                                                    description="This action will remove this equipment from database. This cannot be undone."
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

            <DialogEquipmentExportExcel
                equipmentStatuses={equipmentStatuses}
                equipmentClasses={equipmentClasses}
                open={exportDialog}
                setOpen={setExportDialog}
            />
        </>
    );
}
