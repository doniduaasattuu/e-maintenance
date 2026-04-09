import { ActionConfirm } from '@/components/action-confirm';
import ButtonAdd from '@/components/button-add';
import { GeneratePagination } from '@/components/generate-pagination';
import SearchBar from '@/components/search-bar';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { tableCaption } from '@/lib/utils';
import { MaterialType, Meta } from '@/types';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import EmptyIcon from '../empty-icon';

interface TableMaterialTypeProps {
    materialTypes: {
        data: MaterialType[];
        meta: Meta;
    };
    withHeader?: boolean;
}

export default function TableMaterialType({ materialTypes, withHeader = true }: TableMaterialTypeProps) {
    const { can } = usePermissions();
    const meta = materialTypes.meta;
    const caption = tableCaption(meta);

    function handleDeleteMaterialType(id: number | string) {
        router.delete(route('material-types.destroy', id));
    }
    return (
        <>
            {withHeader && (
                <div className="flex justify-between gap-2">
                    <div className="flex justify-between gap-2">
                        <SearchBar tabIndex={1} />
                    </div>
                    {can.create_materialtype && <ButtonAdd tabIndex={2} route={route('material-types.create')} />}
                </div>
            )}
            <div className="grid min-w-0 overflow-x-auto rounded-md">
                {materialTypes.data && materialTypes.data.length > 0 ? (
                    <Table>
                        <TableCaption className="pb-4 text-sm">{caption}</TableCaption>
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
                                            {can.edit_materialtype ? (
                                                <TextLink href={route('material-types.edit', materialType.id)}>
                                                    <span className="truncate font-medium">{materialType.code}</span>
                                                </TextLink>
                                            ) : (
                                                <span className="truncate font-medium">{materialType.code}</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-sm truncate sm:max-w-md">{materialType.description}</TableCell>
                                        <TableCell className="table-timestamp text-muted-foreground">{materialType.created_at}</TableCell>
                                        <TableCell className={`table-timestamp text-muted-foreground ${can.delete_materialtype ?? 'text-right'}`}>
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
                ) : (
                    <EmptyIcon />
                )}
            </div>
            <GeneratePagination meta={meta} />
        </>
    );
}
