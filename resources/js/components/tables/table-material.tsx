import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { formatCurrency, tableCaption } from '@/lib/utils';
import { Material, MaterialType, MaterialUnit, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import ButtonExport from '../button-export';
import DialogMaterialExportExcel from '../dialog-material-export-excel';
import EmptyIcon from '../empty-icon';
import Filter from '../filter';
import FilterMaterialType from '../filter-material-type';
import FilterMaterialUnit from '../filter-material-unit';
import { PerPageSelector } from '../per-page-selector';
import { ButtonGroup } from '../ui/button-group';
import { CommandSeparator } from '../ui/command';

interface TableMaterialProps {
    materials: {
        data: Material[];
        meta: Meta;
    };
    materialUnits?: {
        data: MaterialUnit[];
    };
    materialTypes?: {
        data: MaterialType[];
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableMaterial({ materials, materialUnits, materialTypes, withHeader = true, filters }: TableMaterialProps) {
    const { can } = usePermissions();
    const meta = materials.meta;
    const caption = tableCaption(meta);
    const [open, setOpen] = React.useState<boolean>(false);

    function handleDeleteMaterial(id: number | string) {
        router.delete(route('materials.destroy', id));
    }

    const [exportDialog, setExportDialog] = useState<boolean>(false);

    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar value={filters.query} tabIndex={1} />
                        <PerPageSelector value={filters.per_page?.toString() ?? '10'} />
                        <Filter open={open} setOpen={setOpen} keys={['unit', 'type']}>
                            <FilterMaterialUnit materialUnits={materialUnits?.data ?? []} />
                            <CommandSeparator />
                            <FilterMaterialType materialTypes={materialTypes?.data ?? []} />
                        </Filter>
                    </div>
                    <ButtonGroup>
                        {can.create_material && <ButtonAdd tabIndex={2} route={route('materials.create')} />}
                        {materials.data.length > 0 && (
                            <ButtonExport tabIndex={3} onClick={() => setExportDialog(true)} label="Export" variant={'outline'} />
                        )}
                    </ButtonGroup>
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {materials.data && materials.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Price</TableHead>
                                <TableHead className="text-muted-foreground">Unit</TableHead>
                                <TableHead className="text-muted-foreground">Type</TableHead>
                                <TableHead className="table-timestamp text-muted-foreground">Created at</TableHead>
                                <TableHead className={`table-timestamp text-muted-foreground ${can.delete_material ?? 'text-right'}`}>
                                    Updated at
                                </TableHead>
                                {can.delete_material && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {materials.data.map((material: Material) => {
                                return (
                                    <TableRow key={material.id}>
                                        <TableCell>
                                            {can.show_material ? (
                                                <TextLink href={route('materials.show', material.id)}>
                                                    <span className="font-medium">{material.code}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{material.code}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-md truncate">{material.name}</TableCell>
                                        <TableCell>{formatCurrency(material.price)}</TableCell>
                                        <TableCell>{material.unit?.name}</TableCell>
                                        <TableCell>{material.type?.code}</TableCell>
                                        <TableCell className="text-muted-foreground">{material.created_at}</TableCell>
                                        <TableCell className={`text-muted-foreground ${can.delete_material ?? 'text-right'}`}>
                                            {material.updated_at}
                                        </TableCell>
                                        {can.delete_material && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteMaterial(material.id)}
                                                    title={`Delete data ${material.name}?`}
                                                    description="This action will remove this unit from database. This action cannot be undone."
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

            <DialogMaterialExportExcel open={exportDialog} setOpen={setExportDialog} materialTypes={materialTypes} />
        </>
    );
}
