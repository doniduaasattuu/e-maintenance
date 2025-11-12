import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { formatCurrency } from '@/lib/utils';
import { Material, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface TableMaterialProps {
    materials: {
        data: Material[];
        meta: Meta;
    };
}

export default function TableMaterial({ materials }: TableMaterialProps) {
    const can = usePermissions();
    const meta = materials.meta;
    const tableCaption = `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total ?? 0} results`;

    function handleDeleteMaterial(id: number | string) {
        router.delete(route('materials.destroy', id));
    }
    return (
        <TableLayout title="Material" description="Overview and management of material">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_material && <ButtonAdd tabIndex={2} route={route('materials.create')} />}
            </div>
            <Table>
                <TableCaption className="text-sm">{tableCaption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-muted-foreground">Code</TableHead>
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Price</TableHead>
                        <TableHead className="text-muted-foreground">Unit</TableHead>
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">Created at</TableHead>
                        <TableHead className={`text-muted-foreground ${can.delete_material ?? 'text-right'}`}>Updated at</TableHead>
                        {can.delete_material && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materials.data.map((material: Material) => {
                        return (
                            <TableRow key={material.id}>
                                <TableCell>
                                    {can.read_material ? (
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
                                <TableCell>{material.materialType?.code}</TableCell>
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
            <GeneratePagination meta={meta} />
        </TableLayout>
    );
}
