import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { EquipmentClass, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface TableEquipmentClassProps {
    equipmentClasses: {
        data: EquipmentClass[];
        meta: Meta;
    };
}

export default function TableEquipmentClass({ equipmentClasses }: TableEquipmentClassProps) {
    const can = usePermissions();
    const meta = equipmentClasses.meta;
    const tableCaption = `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total ?? 0} results`;

    function handleDeleteEquipmentClass(id: number | string) {
        router.delete(route('equipment-classes.destroy', id));
    }
    return (
        <TableLayout title="Equipment Classes" description="Overview and management of equipment classes">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_equipmentclass && <ButtonAdd tabIndex={2} route={route('equipment-classes.create')} />}
            </div>
            <Table>
                <TableCaption className="text-sm">{tableCaption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-muted-foreground">Code</TableHead>
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Description</TableHead>
                        <TableHead className="text-muted-foreground">Created at</TableHead>
                        <TableHead className={`text-muted-foreground ${can.delete_equipmentclass ?? 'text-right'}`}>Updated at</TableHead>
                        {can.delete_equipmentclass && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {equipmentClasses.data.map((equipmentClass: EquipmentClass) => {
                        return (
                            <TableRow key={equipmentClass.id}>
                                <TableCell>
                                    {can.update_equipmentclass ? (
                                        <TextLink href={route('equipment-classes.edit', equipmentClass.id)}>
                                            <span className="font-medium">{equipmentClass.code}</span>
                                        </TextLink>
                                    ) : (
                                        <span className="font-medium">{equipmentClass.code}</span>
                                    )}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">{equipmentClass.name}</TableCell>
                                <TableCell className="max-w-[300px] truncate">{equipmentClass.description}</TableCell>
                                <TableCell className="text-muted-foreground">{equipmentClass.created_at}</TableCell>
                                <TableCell className={`text-muted-foreground ${can.delete_equipmentclass ?? 'text-right'}`}>
                                    {equipmentClass.updated_at}
                                </TableCell>
                                {can.delete_equipmentclass && (
                                    <TableCell className="w-10 flex-col text-right align-top">
                                        <ActionConfirm
                                            action={() => handleDeleteEquipmentClass(equipmentClass.id)}
                                            title={`Delete data ${equipmentClass.code}?`}
                                            description="This action will remove this equipment class from database. This action cannot be undone."
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
