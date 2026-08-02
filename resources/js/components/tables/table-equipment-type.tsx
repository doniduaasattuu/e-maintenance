import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { EquipmentType, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import EmptyIcon from '../empty-icon';
import { PerPageSelector } from '../per-page-selector';
import { ButtonGroup } from '../ui/button-group';

interface TableEquipmentTypeProps {
    equipmentTypes: {
        data: EquipmentType[];
        meta: Meta;
    };
    withHeader?: boolean;
    filters: {
        query: string;
        per_page: string;
    };
}

export default function TableEquipmentType({ equipmentTypes, withHeader = true, filters }: TableEquipmentTypeProps) {
    const { can } = usePermissions();
    const meta = equipmentTypes.meta;
    const caption = tableCaption(meta);

    function handleDeleteEquipmentType(id: number | string) {
        router.delete(route('equipment-types.destroy', id));
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
                        {can.create_equipmenttype && <ButtonAdd tabIndex={3} route={route('equipment-types.create')} />}
                        {/* <ButtonExport tabIndex={4} onClick={() => (window.location.href = route('equipment-types.export'))} /> */}
                    </ButtonGroup>
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {equipmentTypes?.data && equipmentTypes?.data?.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Description</TableHead>
                                <TableHead className="text-muted-foreground">Class</TableHead>
                                <TableHead className="text-muted-foreground">Active</TableHead>
                                <TableHead className="text-muted-foreground">Created at</TableHead>
                                <TableHead className={`text-muted-foreground ${can.delete_equipmenttype ?? 'text-right'}`}>Updated at</TableHead>
                                {can.delete_equipmenttype && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {equipmentTypes.data.map((equipmentType: EquipmentType) => {
                                return (
                                    <TableRow key={equipmentType.id}>
                                        <TableCell className="max-w-75 truncate">
                                            {can.edit_equipmenttype ? (
                                                <TextLink href={route('equipment-types.edit', equipmentType.id)}>
                                                    <span className="font-medium">{equipmentType.code}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{equipmentType.code}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{equipmentType.name}</TableCell>
                                        <TableCell className="max-w-75 truncate">{equipmentType.description}</TableCell>
                                        <TableCell className="max-w-75 truncate">{equipmentType.equipmentClass?.name}</TableCell>
                                        <TableCell className="max-w-75 truncate">{equipmentType.is_active ? 'Yes' : 'No'}</TableCell>
                                        <TableCell className="table-timestamp text-muted-foreground">{equipmentType.created_at}</TableCell>
                                        <TableCell className={`table-timestamp text-muted-foreground ${can.delete_equipmenttype ?? 'text-right'}`}>
                                            {equipmentType.updated_at}
                                        </TableCell>
                                        {can.delete_equipmenttype && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteEquipmentType(equipmentType.id)}
                                                    title={`Delete equipment type: ${equipmentType.name}?`}
                                                    description="This action will remove this equipment type and related equipment from database. This action cannot be undone."
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
