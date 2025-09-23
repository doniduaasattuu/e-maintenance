import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import TableLayout from '@/layouts/table/layout';
import { MaterialType, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

interface TableMaterialTypeProps {
    materialTypes: {
        data: MaterialType[];
        meta: Meta;
    };
}

export default function TableMaterialType({ materialTypes }: TableMaterialTypeProps) {
    const can = usePermissions();
    const meta = materialTypes.meta;
    const tableCaption = `Showing ${meta.from ?? 0} to ${meta.to ?? 0} of ${meta.total ?? 0} results`;

    function handleDeleteMaterialType(id: number | string) {
        router.delete(route('material-types.destroy', id));
    }
    return (
        <TableLayout title="Material Type" description="Overview and management of material type in the system">
            <div className="flex justify-between gap-2">
                <div className="flex justify-between gap-2">
                    <SearchBar tabIndex={1} />
                </div>
                {can.create_materialtype && <ButtonAdd tabIndex={2} route={route('material-types.create')} />}
            </div>
            <Table>
                <TableCaption className="text-sm">{tableCaption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-muted-foreground">Code</TableHead>
                        <TableHead className="text-muted-foreground">Description</TableHead>
                        <TableHead className="text-muted-foreground">Created at</TableHead>
                        <TableHead className={`text-muted-foreground ${can.delete_materialtype ?? 'text-right'}`}>Updated at</TableHead>
                        {can.delete_materialtype && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materialTypes.data.map((materialType: MaterialType) => {
                        return (
                            <TableRow key={materialType.id}>
                                <TableCell>
                                    {can.update_materialtype ? (
                                        <TextLink href={route('material-types.edit', materialType.id)}>
                                            <span className="truncate font-medium">{materialType.code}</span>
                                        </TextLink>
                                    ) : (
                                        <span className="truncate font-medium">{materialType.code}</span>
                                    )}
                                </TableCell>
                                <TableCell className="max-w-sm truncate sm:max-w-md">{materialType.description}</TableCell>
                                <TableCell className="text-muted-foreground">{materialType.created_at}</TableCell>
                                <TableCell className={`text-muted-foreground ${can.delete_materialtype ?? 'text-right'}`}>
                                    {materialType.updated_at}
                                </TableCell>
                                {can.delete_materialtype && (
                                    <TableCell className="w-10 flex-col text-right align-top">
                                        <ActionConfirm
                                            action={() => handleDeleteMaterialType(materialType.id)}
                                            title={`Delete data ${materialType.code}?`}
                                            description="This action will remove this material type from database. This action cannot be undone."
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
