import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { tableCaption } from '@/lib/utils';
import { MaterialUnit, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import EmptyIcon from '../empty-icon';

interface TableMaterialUnitProps {
    materialUnits: {
        data: MaterialUnit[];
        meta: Meta;
    };
}

export default function TableMaterialUnit({ materialUnits }: TableMaterialUnitProps) {
    const { can } = usePermissions();
    const meta = materialUnits.meta;
    const caption = tableCaption(meta);

    function handleDeleteUnit(id: number | string) {
        router.delete(route('material-units.destroy', id));
    }
    return (
        <TableLayout title="Material Unit" description="Overview and management of material unit" className="md:max-w-2xl">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_materialunit && <ButtonAdd tabIndex={2} route={route('material-units.create')} />}
            </div>
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {materialUnits.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-muted-foreground">Name</TableHead>
                                <TableHead className="text-muted-foreground">Created at</TableHead>
                                <TableHead className={`text-muted-foreground ${can.delete_materialunit ?? 'text-right'}`}>Updated at</TableHead>
                                {can.delete_materialunit && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {materialUnits.data.map((materialUnit: MaterialUnit) => {
                                return (
                                    <TableRow key={materialUnit.id}>
                                        <TableCell>
                                            {can.edit_materialunit ? (
                                                <TextLink href={route('material-units.edit', materialUnit.id)}>
                                                    <span className="font-medium">{materialUnit.name}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="font-medium">{materialUnit.name}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="table-timestamp text-muted-foreground">{materialUnit.created_at}</TableCell>
                                        <TableCell className={`table-timestamp text-muted-foreground ${can.delete_materialunit ?? 'text-right'}`}>
                                            {materialUnit.updated_at}
                                        </TableCell>
                                        {can.delete_materialunit && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleDeleteUnit(materialUnit.id)}
                                                    title={`Delete data ${materialUnit.name}?`}
                                                    description="This action will remove this materialUnit from database. This action cannot be undone."
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
