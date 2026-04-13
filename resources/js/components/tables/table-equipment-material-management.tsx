import { ActionConfirm } from '@/components/action-confirm';
import { GeneratePagination } from '@/components/generate-pagination';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import usePermissions from '@/hooks/use-permissions';
import { formatCurrency, tableCaption } from '@/lib/utils';
import { Equipment, Material, MaterialType, MaterialUnit, Meta } from '@/types';
import { useForm } from '@inertiajs/react';
import { Delete } from 'lucide-react';
import { useState } from 'react';
import ButtonSubmit from '../button-submit';
import EmptyIcon from '../empty-icon';
import RequiredLabel from '../required-label';
import { Field, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';

interface TableEquipmentMaterialManagementProps {
    equipment: {
        data: Equipment;
    };
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

export default function TableEquipmentMaterialManagement({ equipment, materials, handleRemove }: TableEquipmentMaterialManagementProps) {
    const { can } = usePermissions();
    const meta = materials.meta;
    const caption = tableCaption(meta);
    const [materialId, setMaterialId] = useState<number | null>(null);
    const [materialName, setmaterialName] = useState<string | null>(null);

    const { data, setData, patch, processing, reset, recentlySuccessful, errors } = useForm({
        material_id: null,
        quantity: 1,
        note: '',
    });

    // EDITING
    const [editingMaterial, setEditingMaterial] = useState<boolean>(false);

    const handleUpdateQuantity = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('equipments.materials.update', [equipment.data.id, materialId]), {
            onSuccess: () => {
                setEditingMaterial(false);
                reset();
            },
        });
    };

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
                                        <TableCell
                                            onClick={() => {
                                                setEditingMaterial(true);
                                                setMaterialId(material.id);
                                                setmaterialName(material.name);
                                                setData('quantity', material.pivot?.quantity ?? 1);
                                                setData('note', material.pivot?.note ?? '');
                                            }}
                                        >
                                            <span className="cursor-context-menu font-medium underline underline-offset-4">{material.code}</span>
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
            <Dialog open={editingMaterial} onOpenChange={setEditingMaterial}>
                <DialogContent>
                    <form onSubmit={handleUpdateQuantity}>
                        <DialogHeader>
                            <DialogTitle>Update Material Quantity</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-6">
                            <p className="text-muted-foreground text-sm">{materialName}</p>
                            <div className="flex items-center justify-between gap-2">
                                <Field>
                                    <FieldLabel htmlFor="quantity">
                                        Quantity
                                        <RequiredLabel />
                                    </FieldLabel>
                                    <Input
                                        id="quantity"
                                        tabIndex={1}
                                        type="number"
                                        step="1"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', parseFloat(e.target.value))}
                                    />
                                    <FieldError>{errors.quantity}</FieldError>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="note">Note</FieldLabel>
                                    <Input
                                        id="note"
                                        tabIndex={2}
                                        value={data.note}
                                        min={'1'}
                                        onChange={(e) => setData('note', e.target.value)}
                                        placeholder="Note"
                                    />
                                    <FieldError>{errors.note}</FieldError>
                                </Field>
                            </div>
                        </div>
                        <DialogFooter>
                            <ButtonSubmit
                                recentlySuccessful={recentlySuccessful}
                                disabled={processing || data.material_id == ''}
                                label="Update"
                                successMessage="Updated"
                                processing={processing}
                                tabIndex={3}
                            />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <GeneratePagination meta={meta} />
        </>
    );
}
