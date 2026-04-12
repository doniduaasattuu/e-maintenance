import { ActionConfirm } from '@/components/action-confirm';
import { GeneratePagination } from '@/components/generate-pagination';
import TextLink from '@/components/text-link';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { formatCurrency, tableCaption } from '@/lib/utils';
import { Material, MaterialType, MaterialUnit, Meta } from '@/types';
import { Delete } from 'lucide-react';
import EmptyIcon from '../empty-icon';

interface TableEquipmentMaterialManagementProps {
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
    handleRemove: (id: number) => void;
}

export default function TableEquipmentMaterialManagement({ materials, handleRemove }: TableEquipmentMaterialManagementProps) {
    const { can } = usePermissions();
    const meta = materials.meta;
    const caption = tableCaption(meta);

    return (
        <>
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
                                <TableHead className="table-timestamp text-muted-foreground">Qty</TableHead>
                                <TableHead className="table-timestamp text-muted-foreground">Note</TableHead>
                                {can.update_equipment && <TableHead className="text-muted-foreground w-10 text-right"></TableHead>}
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
                                        <TableCell className="text-muted-foreground">{material.pivot?.quantity}</TableCell>
                                        <TableCell className="text-muted-foreground">{material.pivot?.note}</TableCell>
                                        {can.update_equipment && (
                                            <TableCell className="w-10 flex-col text-right align-top">
                                                <ActionConfirm
                                                    action={() => handleRemove(material.id)}
                                                    title={`Remove ${material.name}?`}
                                                    description="This action will remove the material from this asset's list. This does not affect the master material stock."
                                                    actionLabel="Remove"
                                                >
                                                    <Delete size={18} className="text-red-500" />
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
