import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { tableCaption } from '@/lib/utils';
import { EquipmentClass, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import EmptyIcon from '../empty-icon';

interface TableEquipmentClassProps {
    equipmentClasses: {
        data: EquipmentClass[];
        meta: Meta;
    };
}

export default function TableEquipmentClass({ equipmentClasses }: TableEquipmentClassProps) {
    const { can } = usePermissions();
    const meta = equipmentClasses.meta;
    const caption = tableCaption(meta);

    function handleDeleteEquipmentClass(id: number | string) {
        router.delete(route('equipment-classes.destroy', id));
    }
    return (
        <TableLayout title="Equipment Class" description="Overview and management of equipment classes" className="md:max-w-7xl">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_equipmentclass && <ButtonAdd tabIndex={2} route={route('equipment-classes.create')} />}
            </div>
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {equipmentClasses.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Code</TableHead>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Formable</TableHead>
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
                                            {can.edit_equipmentclass ? (
                                                <TextLink href={route('equipment-classes.edit', equipmentClass.id)}>
                                                    <span className="font-medium">{equipmentClass.code}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{equipmentClass.code}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-50 truncate">{equipmentClass.name}</TableCell>
                                        <TableCell>{equipmentClass.formable_type}</TableCell>
                                        <TableCell className="max-w-75 truncate">{equipmentClass.description}</TableCell>
                                        <TableCell className="table-timestamp text-muted-foreground">{equipmentClass.created_at}</TableCell>
                                        <TableCell className={`table-timestamp text-muted-foreground ${can.delete_equipmentclass ?? 'text-right'}`}>
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
                ) : (
                    <EmptyIcon />
                )}
            </div>
            <GeneratePagination meta={meta} />
        </TableLayout>
    );
}
